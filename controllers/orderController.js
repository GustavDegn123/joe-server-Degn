// controllers/orderController.js
const { createOrder } = require('../models/orderModel');
const createCheckoutSession = require('../public/scripts/stripe');

const handlePayWithCard = async (req, res) => {
    try {
        const { user_id, products, points, total } = req.body;

        // Convert total to total_price
        const total_price = total;

        // Create a Stripe checkout session
        const session = await createCheckoutSession(total_price * 100); // Stripe expects amount in cents

        // Prepare order data
        const orderData = {
            user_id,
            products,
            total_price,
            points_earned: points,
            payment_method: 'card',
            order_date: new Date()
        };

        // Save the order in the database
        const orderId = await createOrder(orderData);

        res.json({ sessionId: session.id, orderId });
    } catch (error) {
        console.error('Error processing card payment:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { handlePayWithCard };
