const { createOrder } = require('../models/orderModel');
const createCheckoutSession = require('../public/scripts/stripe');

const handlePayWithCard = async (req, res) => {
    try {
        const { user_id, products, total } = req.body;

        // Convert total to total_price
        const total_price = total;

        // Calculate points_earned using unitPoints from the products array
        let points_earned = 0;
        for (const product of products) {
            points_earned += product.unitPoints * product.quantity; // Use unitPoints provided in the request
            console.log(`Calculating points for ${product.name}: ${product.unitPoints} * ${product.quantity} = ${product.unitPoints * product.quantity}`);
        }

        console.log("Total points_earned:", points_earned);

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

        console.log("Order data being saved:", orderData);

        // Save the order in the database
        const orderId = await createOrder(orderData);

        res.json({ sessionId: session.id, orderId });
    } catch (error) {
        console.error('Error processing card payment:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { handlePayWithCard };
