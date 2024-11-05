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

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', user_id)
            .input('products', JSON.stringify(products)) // Assuming products is an array/object; converting to JSON string
            .input('total_price', total_price)
            .input('points_earned', points_earned)
            .input('payment_method', payment_method)
            .input('order_date', order_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, payment_method, order_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @payment_method, @order_date)
            `);

        return result;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Export the function directly if it's not a class-based model
module.exports = { createOrder };
