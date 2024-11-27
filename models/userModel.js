// models/userModel.js
const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Create a new user with hashed password
const createUser = async (userData) => {
    console.log("Creating user in database:", userData);
    const { 
        name, 
        email, 
        phone, 
        country, 
        password, // Encrypted password
        iv,       // IV for the password encryption
        terms_accepted, 
        loyalty_program_accepted, 
        latitude, 
        longitude 
    } = userData;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('name', name)
            .input('email', email)
            .input('phone_number', phone)
            .input('country', country)
            .input('hashed_password', password) // Save the encrypted password
            .input('password_iv', iv)           // Save the IV in the database
            .input('loyalty_points', 0)
            .input('terms_accepted', terms_accepted)
            .input('loyalty_program_accepted', loyalty_program_accepted)
            .input('latitude', latitude)
            .input('longitude', longitude)
            .query(`
                INSERT INTO Users 
                (name, email, phone_number, country, hashed_password, password_iv, loyalty_points, terms_accepted, loyalty_program_accepted, latitude, longitude)
                OUTPUT INSERTED.user_id
                VALUES 
                (@name, @email, @phone_number, @country, @hashed_password, @password_iv, @loyalty_points, @terms_accepted, @loyalty_program_accepted, @latitude, @longitude)
            `);

        console.log("User created successfully:", result);
        return result.recordset[0]; // Return the inserted user ID or details
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Ensure the error is thrown for proper handling in the controller
    }
};

// Fetch user by email
const getUserByEmail = async (email) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('email', email)
            .query('SELECT * FROM Users WHERE email = @email');
        
        return result.recordset[0]; // Return the first matching user
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};

// Update user's loyalty points
const updateUserLoyaltyPoints = async (userId, pointsToAdd) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .input('pointsToAdd', pointsToAdd)
            .query(`
                UPDATE Users
                SET loyalty_points = loyalty_points + @pointsToAdd
                WHERE user_id = @user_id
            `);

        console.log(`Loyalty points updated for user ${userId}. Points added: ${pointsToAdd}`);
        return result;
    } catch (error) {
        console.error('Error updating user loyalty points:', error);
        throw error;
    }
};

// Verify password using bcrypt
const verifyPassword = async (inputPassword, storedHash) => {
    try {
        return await bcrypt.compare(inputPassword, storedHash); // Compare hashed and input password
    } catch (error) {
        console.error('Error comparing password:', error);
        throw error;
    }
};

module.exports = { createUser, getUserByEmail, updateUserLoyaltyPoints, verifyPassword };
