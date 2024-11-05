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

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            console.log('Received metadata from Stripe webhook:', session.metadata);

            // Optionally send an order confirmation email
            if (session.customer_details && session.customer_details.email) {
                await sendOrderConfirmation(session.customer_details.email, {
                    total_price: session.amount_total / 100, // Convert cents to currency
                    payment_method: 'card',
                    order_date: new Date()
                });
                console.log("Order confirmation email sent successfully.");
            }

            res.status(200).send();
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
