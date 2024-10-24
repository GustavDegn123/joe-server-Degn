// models/userModel.js
const { getConnection } = require('../config/db');

const createUser = async (userData) => {
    const { name, email, phone_number, country, hashed_password, loyalty_points, loyalty_level } = userData;
    
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('name', name)
            .input('email', email)
            .input('phone_number', phone_number)
            .input('country', country)
            .input('hashed_password', hashed_password)
            .input('loyalty_points', loyalty_points)
            .input('loyalty_level', loyalty_level)
            .query(`
                INSERT INTO Users (name, email, phone_number, country, hashed_password, loyalty_points, loyalty_level)
                VALUES (@name, @email, @phone_number, @country, @hashed_password, @loyalty_points, @loyalty_level)
            `);
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

module.exports = { createUser };

