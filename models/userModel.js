const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt');
const { encryptWithPublicKey } = require('../controllers/asymmetricController');

const saltRounds = 10;

const createUser = async (userData) => {
    console.log('Creating user in database:', userData);
    const {
        name,
        email,
        phone,
        country,
        password,
        terms_accepted,
        loyalty_program_accepted,
        latitude,
        longitude,
    } = userData;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('name', name)
            .input('email', email)
            .input('phone_number', phone)
            .input('country', country)
            .input('hashed_password', hashedPassword)
            .input('loyalty_points', 0) // Default value for loyalty points
            .input('terms_accepted', terms_accepted)
            .input('loyalty_program_accepted', loyalty_program_accepted)
            .input('latitude', latitude)
            .input('longitude', longitude)
            .query(
                `
                INSERT INTO Users (name, email, phone_number, country, hashed_password, loyalty_points, terms_accepted, loyalty_program_accepted, latitude, longitude)
                OUTPUT INSERTED.user_id
                VALUES (@name, @email, @phone_number, @country, @hashed_password, @loyalty_points, @terms_accepted, @loyalty_program_accepted, @latitude, @longitude)
            `
            );

        console.log('User created successfully:', result);
        return result; // Return the result for further use
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Encrypt the email and update it in the database
const encryptAndSaveEmail = async (userId, email) => {
    try {
        const encryptedEmail = encryptWithPublicKey(email);
        console.log('Encrypted Email:', encryptedEmail);

        const pool = await getConnection();
        await pool
            .request()
            .input('user_id', userId)
            .input('encryptedEmail', encryptedEmail)
            .query(`
                UPDATE Users
                SET email = @encryptedEmail
                WHERE user_id = @user_id
            `);

        console.log(`Email encrypted and updated for user ${userId}`);
    } catch (error) {
        console.error('Error encrypting and saving email:', error);
        throw error;
    }
};

// Function to update the user's loyalty points in the database
const updateUserLoyaltyPoints = async (userId, pointsToAdd) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
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

const getUserByEmail = async (email) => {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input('email', email)
        .query('SELECT * FROM Users WHERE email = @email');
    return result.recordset[0]; // Return the user record
};

module.exports = {createUser, encryptAndSaveEmail, updateUserLoyaltyPoints, getUserByEmail};
