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

const createOrderWithLoyaltyPoints = async (orderData) => {
    console.log("createOrderWithLoyaltyPoints called");
    const {
        user_id,
        products,
        total_price,
        payment_method,
        order_date
    } = orderData;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', user_id)
            .input('products', JSON.stringify(products))
            .input('total_price', total_price)
            .input('points_earned', 0)
            .input('payment_method', payment_method)
            .input('order_date', order_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, payment_method, order_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @payment_method, @order_date)
            `);

        console.log("Result from query execution:", result); // Log the result to inspect the structure
        console.log("Order ID returned:", result.recordset[0].id); // Log the ID if available

        return result.recordset[0].id;
    } catch (error) {
        console.error('Error creating order with loyalty points:', error); // Log the full error
        throw error;
    }
};

const getProductPointsValue = async (productId) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('productId', productId)
        .query('SELECT points_value FROM Products WHERE id = @productId'); // Correctly uses 'id'
    return result.recordset[0].points_value;
};

// Function to get user by ID
const getUserById = async (userId) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM Users WHERE user_id = @userId'); // Use 'user_id' instead of 'id'
    return result.recordset[0];
};


const updateUserPoints = async (userId, newPoints) => {
    const pool = await getConnection();
    await pool.request()
        .input('newPoints', newPoints)
        .input('userId', userId)
        .query('UPDATE Users SET loyalty_points = @newPoints WHERE user_id = @userId'); // Correctly uses 'user_id'
};

// Function to get product ID by product name
const getProductIdByName = async (productName) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('productName', productName)
        .query('SELECT id FROM Products WHERE name = @productName');
    
    return result.recordset.length ? result.recordset[0].id : null;
};

module.exports = { createOrder, getUserById, updateUserPoints, getProductPointsValue, createOrderWithLoyaltyPoints, getProductIdByName };

