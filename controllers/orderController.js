const { getProductIdByName, createOrderWithLoyaltyPoints, getProductPointsValue, getUserById, updateUserPoints } = require('../models/orderModel');
const { createOrder } = require('../models/orderModel');
const { updateUserLoyaltyPoints } = require('../models/userModel');
const createCheckoutSession = require('../public/scripts/stripe');

const handlePayWithCard = async (req, res) => {
    try {
        const { products, total } = req.body;
        const user_id = req.userId; // Get userId from authMiddleware

        const total_price = total;

        let points_earned = 0;
        for (const product of products) {
            points_earned += product.unitPoints * product.quantity;
        }

        const session = await createCheckoutSession(total_price * 100);

        const orderData = {
            user_id,
            products,
            total_price,
            points_earned,
            payment_method: 'card',
            order_date: new Date()
        };

        const orderId = await createOrder(orderData);

        await updateUserLoyaltyPoints(user_id, points_earned);

        res.json({ sessionId: session.id, orderId });
    } catch (error) {
        console.error('Error processing card payment:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const handlePayWithLoyaltyPoints = async (req, res) => {
    try {
        const { products, points } = req.body;
        const user_id = req.userId; // Get userId from authMiddleware

        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.loyalty_points < points) {
            return res.status(400).json({ message: "Insufficient loyalty points" });
        }

        let totalPointsCost = 0;
        for (const product of products) {
            totalPointsCost += product.totalPrice * product.quantity;
        }

        if (user.loyalty_points < totalPointsCost) {
            return res.status(400).json({ message: "Insufficient loyalty points" });
        }

        const newPointsBalance = user.loyalty_points - totalPointsCost;
        await updateUserPoints(user_id, newPointsBalance);

        const orderData = {
            user_id,
            products,
            total_price: 0,
            payment_method: 'loyalty points',
            order_date: new Date()
        };

        const orderId = await createOrderWithLoyaltyPoints(orderData);
        res.status(200).json({ orderId });
    } catch (error) {
        console.error("Error processing loyalty points payment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { handlePayWithCard, handlePayWithLoyaltyPoints };
