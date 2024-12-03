const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { updateOrderStatus, getUserById } = require('../models/orderModel');
const sendOrderConfirmation = require('../controllers/sendOrderConfirmation');
const { decryptWithPrivateKey } = require('../controllers/asymmetricController');

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

            // Retrieve user ID from the metadata and fetch user information
            const userId = session.metadata?.userId;
            if (userId) {
                const user = await getUserById(userId);

                // Decrypt the user's email
                let decryptedEmail;
                try {
                    decryptedEmail = decryptWithPrivateKey(user.email);
                } catch (error) {
                    console.error(`Error decrypting email for user ID ${userId}:`, error.message);
                    throw error;
                }

                // Send order confirmation email
                if (decryptedEmail) {
                    await sendOrderConfirmation(decryptedEmail, orderDetails, userId);
                    console.log("Order confirmation email sent successfully.");
                } else {
                    console.log("Decrypted email is null or undefined.");
                }
            } else {
                console.log("User ID is missing in metadata.");
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
