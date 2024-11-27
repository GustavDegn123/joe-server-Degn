// models/userModel.js
const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const createUser = async (userData) => {
    const {
        name, // Encrypted name
        email, // Encrypted email
        phone, // Encrypted phone
        country, // Encrypted country
        latitude, // Encrypted latitude
        longitude, // Encrypted longitude
        password, // Plain password to be hashed
        terms_accepted,
        loyalty_program_accepted,
    } = userData;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password
        const pool = await getConnection();
        const result = await pool.request()
            .input('name', name)
            .input('email', email)
            .input('phone_number', phone)
            .input('country', country)
            .input('latitude', latitude)
            .input('longitude', longitude)
            .input('hashed_password', hashedPassword)
            .input('loyalty_points', 0) // Default loyalty points
            .input('terms_accepted', terms_accepted)
            .input('loyalty_program_accepted', loyalty_program_accepted)
            .query(`
                INSERT INTO Users (name, email, phone_number, country, latitude, longitude, hashed_password, loyalty_points, terms_accepted, loyalty_program_accepted)
                OUTPUT INSERTED.user_id
                VALUES (@name, @encryptedEmail, @phone_number, @country, @latitude, @longitude, @hashed_password, @loyalty_points, @terms_accepted, @loyalty_program_accepted)
            `);

        console.log("User created successfully:", result);
        return result;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};


// Fetch a user by email
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

// Update the user's loyalty points in the database
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

module.exports = { createUser, getUserByEmail, updateUserLoyaltyPoints };
