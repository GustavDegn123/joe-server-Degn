const { getConnection } = require('../config/db');

// Function to create a new order
const createOrder = async (orderData) => {
    const {
        user_id,
        products,
        total_price,
        points_earned,
        payment_method = 'card',
        order_date = new Date(),
    } = orderData;

    console.log("Order data before saving:", orderData); // Log order data before saving

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', user_id)
            .input('products', JSON.stringify(products)) // Convert products to JSON string for storage
            .input('total_price', total_price)
            .input('points_earned', points_earned)
            .input('payment_method', payment_method)
            .input('order_date', order_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, payment_method, order_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @payment_method, @order_date)
            `);

        console.log("Order saved successfully:", result); // Log result after successful insertion
        return result.recordset[0]; // Returning the inserted order's ID or other details
    } catch (error) {
        console.error('Error creating order:', error); // Log any errors during order creation
        throw error; // Re-throw error to handle it higher up in the call stack
    }
};

// Export the function
module.exports = { createOrder };
