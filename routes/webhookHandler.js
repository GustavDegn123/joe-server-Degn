const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { updateOrderStatus } = require('../models/orderModel');
const sendOrderConfirmation = require('../controllers/sendOrderConfirmation');

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        let event;

        if (process.env.NODE_ENV === 'test') {
            event = req.body; // Skip signature verification in testing
            console.log("Running in test mode, skipping signature verification.");
        } else {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Signature verified.");
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            console.log('Received metadata from Stripe webhook:', session.metadata);

            // Retrieve orderId from metadata
            const orderId = session.metadata?.orderId;

            if (!orderId) {
                console.error("Order ID missing in metadata.");
                return res.status(400).send('Order ID is required.');
            }

            // Update the order status in the database
            await updateOrderStatus(orderId, 'completed');
            console.log(`Order ${orderId} status updated to completed.`);

            // Prepare order details for the email
            const orderDetails = `
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total Price:</strong> ${(session.amount_total / 100).toFixed(2)} DKK</p>
                <p><strong>Payment Method:</strong> ${session.payment_method_types[0]}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
            `;

            // Send order confirmation email
            if (session.customer_details && session.customer_details.email) {
                await sendOrderConfirmation(session.customer_details.email, orderDetails, orderId);
                console.log("Order confirmation email sent successfully.");
            } else {
                console.log("No customer email found in session.");
            }

            res.status(200).send('Webhook received and processed.');
        } else {
            console.log("Unhandled event type:", event.type);
            res.status(400).send('Unhandled event type');
        }
    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = handleStripeWebhook;
