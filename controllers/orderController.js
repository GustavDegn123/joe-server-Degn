const { createOrder } = require('../models/orderModel');
const { updateUserLoyaltyPoints } = require('../models/userModel');
const createCheckoutSession = require('../public/scripts/stripe');

const handlePayWithCard = async (req, res) => {
    try {
        const { user_id, products, total } = req.body;

        // Convert total to total_price
        const total_price = total;

        // Calculate points_earned directly from the products array
        let points_earned = 0;
        for (const product of products) {
            points_earned += product.unitPoints * product.quantity;
        }

        // Create a Stripe checkout session
        const session = await createCheckoutSession(total_price * 100); // Stripe expects amount in cents

        // Prepare order data
        const orderData = {
            user_id,
            products,
            total_price,
            points_earned,
            payment_method: 'card',
            order_date: new Date()
        };

        // Save the order in the database
        const orderId = await createOrder(orderData);

        // Update user's loyalty points in the database
        await updateUserLoyaltyPoints(user_id, points_earned);

        res.json({ sessionId: session.id, orderId });
    } catch (error) {
        console.error('Error processing card payment:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { handlePayWithCard };
