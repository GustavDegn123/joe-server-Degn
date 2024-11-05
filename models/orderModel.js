// models/orderModel.js
const { getConnection } = require('../config/db');

// Function to create a new order
const createOrder = async (orderData) => {
    console.log("Creating order in database:", orderData);
    const {
        user_id,
        products,
        total_price,
        points_earned,
        status = 'Pending',
        payment_status = 'Unpaid',
        payment_method = 'card',
        order_date = new Date(),
        payment_date = null
    } = orderData;
    
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', user_id)
            .input('products', JSON.stringify(products)) // Assuming products is an array/object; converting to JSON string
            .input('total_price', total_price)
            .input('points_earned', points_earned)
            .input('status', status)
            .input('payment_status', payment_status)
            .input('payment_method', payment_method)
            .input('order_date', order_date)
            .input('payment_date', payment_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, status, payment_status, payment_method, order_date, payment_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @status, @payment_status, @payment_method, @order_date, @payment_date)
            `);

        console.log("Order created successfully:", result);
        return result;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Function to get orders by user ID
const getOrdersByUserId = async (user_id) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', user_id)
            .query('SELECT * FROM Orders WHERE user_id = @user_id ORDER BY order_date DESC');
        
        return result.recordset; // Returns an array of orders for the user
    } catch (error) {
        console.error('Error fetching orders by user ID:', error);
        throw error;
    }
};

module.exports = { createOrder, getOrdersByUserId };
