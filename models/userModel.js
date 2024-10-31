// models/userModel.js
const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Funktion til at oprette en ny bruger med hash'et adgangskode
const createUser = async (userData) => {
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
        // Hash password før det gemmes
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
                VALUES (@name, @email, @phone_number, @country, @hashed_password, @loyalty_points, @loyalty_level, @terms_accepted, @loyalty_program_accepted, @latitude, @longitude)
            `);
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
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

module.exports = { createUser, getUserByEmail };
