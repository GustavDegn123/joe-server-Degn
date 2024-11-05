// models/orderModel.js
const { getConnection } = require('../config/db');

// Function to create a new order in the database
const createOrder = async (orderData) => {
    console.log("Creating order in database:", orderData);
    const {
        user_id,
        products,
        total_price,
        points_earned,
        payment_method,
        order_date
    } = orderData;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', user_id)
            .input('products', JSON.stringify(products)) // Convert products array to JSON string
            .input('total_price', total_price)
            .input('points_earned', points_earned)
            .input('payment_method', payment_method)
            .input('order_date', order_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, payment_method, order_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @payment_method, @order_date)
            `);

        console.log("Order created successfully:", result); // Confirm success in the log
        return result.recordset[0].id; // Return the inserted order's ID
    } catch (error) {
        console.error('Error creating order:', error); // Log detailed error
        throw error;
    }
};

module.exports = { createOrder };
