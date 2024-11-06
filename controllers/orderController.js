const { getProductIdByName, createOrderWithLoyaltyPoints, getProductPointsValue, getUserById, updateUserPoints } = require('../models/orderModel');
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

const handlePayWithLoyaltyPoints = async (req, res) => {
    try {
        const { user_id, products, points } = req.body;

        // Fetch user from the database
        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user has enough points
        if (user.loyalty_points < points) {
            return res.status(400).json({ message: "Insufficient loyalty points" });
        }

        // Convert product names to product IDs and calculate total points cost
        let totalPointsCost = 0;
        for (const product of products) {
            const productId = await getProductIdByName(product.name); // Get product ID by name
            if (!productId) {
                return res.status(404).json({ error: `Product not found: ${product.name}` });
            }
            product.productId = productId; // Add productId to the product object for further use
            
            const productPointsValue = await getProductPointsValue(productId);
            totalPointsCost += productPointsValue * product.quantity;
        }

        // Deduct points from user's balance
        const newPointsBalance = user.loyalty_points - totalPointsCost;
        await updateUserPoints(user_id, newPointsBalance);

        // Create order with loyalty points payment
        const orderData = {
            user_id: user_id,
            products: products,
            total_price: 0, // Assuming the price is 0 since it's paid by points
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
