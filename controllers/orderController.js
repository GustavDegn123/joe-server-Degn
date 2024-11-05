// controllers/orderController.js
const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  try {
    const { user_id, products, total_price, points_earned, payment_method } = req.body;

    // Create a new order document
    const newOrder = new Order({
      user_id,
      products: JSON.stringify(products), // Convert products to JSON string if needed
      total_price,
      points_earned,
      payment_method,
      order_date: new Date(),
      status: 'Pending',
      payment_status: 'Unpaid'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};
