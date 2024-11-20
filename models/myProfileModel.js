const { getConnection } = require('../config/db');
const bcrypt = require("bcrypt");

// Function to get user data for loyalty card
const getUserLoyaltyCardData = async (userId) => {
    const pool = await getConnection();
    
    // Fetch user details and count of orders in a single query
    const result = await pool.request()
        .input('user_id', userId)
        .query(`
            SELECT u.user_id, u.name, u.email, u.phone_number, u.country, u.loyalty_points,
                   (SELECT COUNT(*) FROM Orders WHERE user_id = @user_id) AS total_orders
            FROM Users u
            WHERE u.user_id = @user_id
        `);
    
    return result.recordset[0];
};

// Function to update user profile with editable fields, including password
const updateUserProfile = async (userId, { name, email, phone_number, country, password }) => {
    const pool = await getConnection();
    const request = pool.request()
        .input('user_id', userId)
        .input('name', name)
        .input('email', email)
        .input('phone_number', phone_number)
        .input('country', country);

    // If a new password is provided, hash it before storing
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        request.input('hashed_password', hashedPassword);
    }

    await request.query(`
        UPDATE Users 
        SET 
            name = @name, 
            email = @email, 
            phone_number = @phone_number, 
            country = @country
            ${password ? ", hashed_password = @hashed_password" : ""}
        WHERE user_id = @user_id
    `);
};

module.exports = { getUserLoyaltyCardData, updateUserProfile };