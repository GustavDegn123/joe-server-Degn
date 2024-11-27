// models/userModel.js
const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const createUser = async (userData) => {
    console.log("Creating user in database:", userData);

    const { 
        encryptedName, 
        encryptedEmail, 
        encryptedPhone, 
        encryptedCountry, 
        encryptedLatitude, 
        encryptedLongitude, 
        password, 
        terms_accepted, 
        loyalty_program_accepted 
    } = userData;

    try {
        // Decrypt sensitive data using the provided decryption function
        const name = await decryptData(encryptedName);
        const email = await decryptData(encryptedEmail);
        const phone = await decryptData(encryptedPhone);
        const country = await decryptData(encryptedCountry);
        const latitude = parseFloat(await decryptData(encryptedLatitude));
        const longitude = parseFloat(await decryptData(encryptedLongitude));

        console.log("Decrypted data:", { name, email, phone, country, latitude, longitude });

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Connect to the database and insert the user record
        const pool = await getConnection();
        const result = await pool.request()
            .input('name', name)
            .input('email', email)
            .input('phone_number', phone) // Correct field mapping
            .input('country', country)
            .input('hashed_password', hashedPassword)
            .input('loyalty_points', 0) // Default value for loyalty points
            .input('terms_accepted', terms_accepted)
            .input('loyalty_program_accepted', loyalty_program_accepted)
            .input('latitude', latitude)
            .input('longitude', longitude)
            .query(`
                INSERT INTO Users (name, email, phone_number, country, hashed_password, loyalty_points, terms_accepted, loyalty_program_accepted, latitude, longitude)
                OUTPUT INSERTED.user_id
                VALUES (@name, @email, @phone_number, @country, @hashed_password, @loyalty_points, @terms_accepted, @loyalty_program_accepted, @latitude, @longitude)
            `);

        console.log("User created successfully:", result.recordset[0]);
        return result; // Return the result for further use
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Ensure the error is thrown for proper handling in the controller
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
