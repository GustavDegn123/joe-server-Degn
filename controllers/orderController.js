const { createOrder } = require('../models/orderModel');

// Controller function to handle order creation
exports.createOrder = async (req, res) => {
    try {
        const { user_id, products, total_price, points_earned, payment_method } = req.body;

        // Call the createOrder function from orderModel
        const orderResult = await createOrder({
            user_id,
            products,
            total_price,
            points_earned,
            payment_method
        });

        res.status(201).json({ message: 'Order created successfully', order: orderResult });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};
