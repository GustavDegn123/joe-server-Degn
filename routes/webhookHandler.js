const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendOrderConfirmation = require('../controllers/sendOrderConfirmation');
const { createOrder } = require('../models/orderModel');

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        let event;

        // Check if in testing mode (skip signature verification in testing)
        if (process.env.NODE_ENV === 'test') {
            event = req.body;
        } else {
            // Use Stripe’s signature verification in production
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { user_id, basket, points } = session.metadata;

            console.log('Received metadata from Stripe webhook:', session.metadata);

            const orderData = {
                user_id,
                products: JSON.parse(basket),
                total_price: session.amount_total / 100,
                points_earned: parseInt(points),
                payment_method: 'card',
                order_date: new Date()
            };

            const orderResult = await createOrder(orderData);
            console.log('Order successfully created in database:', orderResult);

            res.status(200).send();
        } else {
            res.status(400).send('Unhandled event type');
        }
    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = handleStripeWebhook;
