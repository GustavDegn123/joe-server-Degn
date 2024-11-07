const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendOrderConfirmation = require('../controllers/sendOrderConfirmation');

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        let event;

        // Check if in testing mode (skip signature verification in testing)
        if (process.env.NODE_ENV === 'test') {
            event = req.body;
            console.log("Running in test mode, skipping signature verification.");
        } else {
            // Use Stripe’s signature verification in production
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Signature verified.");
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            console.log('Received metadata from Stripe webhook:', session.metadata);

            // Prepare order details for the email
            const orderDetails = `
              <p><strong>Total Price:</strong> ${session.amount_total / 100} DKK</p>
              <p><strong>Payment Method:</strong> ${session.payment_method_types[0]}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
            `;

            // Check if email exists and send the order confirmation
            if (session.customer_details && session.customer_details.email) {
                await sendOrderConfirmation(session.customer_details.email, orderDetails);
                console.log("Order confirmation email sent successfully.");
            } else {
                console.log("No customer email found in session data.");
            }

            // Acknowledge receipt of the event to Stripe
            res.status(200).send('Webhook received and processed.');
        } else {
            console.log("Unhandled event type received:", event.type);
            res.status(400).send('Unhandled event type');
        }
    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = handleStripeWebhook;
