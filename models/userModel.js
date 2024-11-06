// models/userModel.js
const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Funktion til at oprette en ny bruger med hash'et adgangskode
const createUser = async (userData) => {
    console.log("Creating user in database:", userData);
    const { 
        name, 
        email, 
        phone_number, 
        country, 
        password, 
        loyalty_points = 0, 
        loyalty_level = 'Bronze', 
        terms_accepted, 
        loyalty_program_accepted, 
        latitude, 
        longitude 
    } = userData;
    
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const pool = await getConnection();
        const result = await pool.request()
            .input('name', name)
            .input('email', email)
            .input('phone_number', phone_number)
            .input('country', country)
            .input('hashed_password', hashedPassword)
            .input('loyalty_points', loyalty_points)
            .input('loyalty_level', loyalty_level)
            .input('terms_accepted', terms_accepted)
            .input('loyalty_program_accepted', loyalty_program_accepted)
            .input('latitude', latitude)
            .input('longitude', longitude)
                .query(`
                INSERT INTO Users (name, email, phone_number, country, hashed_password, loyalty_points, loyalty_level, terms_accepted, loyalty_program_accepted, latitude, longitude)
                OUTPUT INSERTED.user_id
                VALUES (@name, @email, @phone_number, @country, @hashed_password, @loyalty_points, @loyalty_level, @terms_accepted, @loyalty_program_accepted, @latitude, @longitude)
            `);

        console.log("User created successfully:", result); // Bekræft succes i loggen
        return result;
    } catch (error) {
        console.error('Error creating user:', error); // Log detaljeret fejl
        throw error;
    }
};

// Funktion til at hente en bruger baseret på email
const getUserByEmail = async (email) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('email', email)
            .query('SELECT * FROM Users WHERE email = @email');
        
        return result.recordset[0]; // Returnerer den første matchende bruger
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};

// Function to update the user's loyalty points in the database
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

module.exports = { createUser, getUserByEmail, updateUserLoyaltyPoints};
