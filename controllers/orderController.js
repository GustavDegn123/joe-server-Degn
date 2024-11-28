const { getProductIdByName, createOrderWithLoyaltyPoints, getProductPointsValue, getUserById, updateUserPoints } = require('../models/orderModel');
const { createOrder } = require('../models/orderModel');
const { updateUserLoyaltyPoints } = require('../models/userModel');
const createCheckoutSession = require('../public/scripts/stripe');
const sendOrderConfirmation = require('./sendOrderConfirmation');


const handlePayWithCard = async (req, res) => {
    try {
        const { products, total } = req.body;
        const user_id = req.userId;

        const total_price = total;
        let points_earned = 0;
        for (const product of products) {
            points_earned += product.unitPoints * product.quantity;
        }

        // Create the order in the database first
        const orderData = {
            user_id,
            products,
            total_price,
            points_earned,
            payment_method: 'card',
            order_date: new Date()
        };
        const orderId = await createOrder(orderData); // Save the order and get the orderId

        // Pass the orderId to createCheckoutSession
        const session = await createCheckoutSession(total_price * 100, orderId);

        await updateUserLoyaltyPoints(user_id, points_earned);

        res.json({ sessionId: session.id, orderId }); // Return both sessionId and orderId
    } catch (error) {
        console.error('Error processing card payment:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const handlePayWithLoyaltyPoints = async (req, res) => {
    const { user_id, products, points } = req.body;

    try {
        // Calculate total price in points
        const totalPrice = products.reduce((sum, product) => {
            return sum + product.quantity * product.unitPoints;
        }, 0);

        if (points < totalPrice) {
            return res.status(400).json({
                message: 'Not enough points to complete the purchase.',
            });
        }

        // Deduct points
        const remainingPoints = points - totalPrice;
        await updateUserPoints(user_id, remainingPoints);

        // Create order in the database
        const orderId = await createOrderWithLoyaltyPoints({
            user_id,
            products,
            total_price: totalPrice,
            payment_method: 'loyalty_points',
            order_date: new Date(),
        });

        // Fetch user information for email
        const user = await getUserById(user_id);

        // Prepare order details for email
        const orderDetails = products
            .map(
                (product) =>
                    `<p>${product.quantity}x ${product.name}: ${product.unitPoints * product.quantity} points</p>`
            )
            .join('');

        // Send confirmation email
        await sendOrderConfirmation(user.email, orderDetails, user_id);

        // Include `orderId` in the response for frontend redirection
        res.status(200).json({
            message: 'Payment successful with loyalty points.',
            orderId,
        });
    } catch (error) {
        console.error('Error processing loyalty points payment:', error);
        res.status(500).json({
            message: 'An error occurred during loyalty points payment.',
            error,
        });
    }
};

module.exports = { handlePayWithCard, handlePayWithLoyaltyPoints };
