const { createUser } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');
const { sendSms } = require('./twilioService'); // Import the Twilio SMS service
const { decryptData } = require('./asymmetricController'); // Import asymmetric decryption

const createUserController = async (req, res) => {
    const {
        encryptedName,
        encryptedEmail,
        encryptedPhone,
        encryptedCountry,
        encryptedLatitude,
        encryptedLongitude,
        password,
        terms_accepted,
        loyalty_program_accepted,
    } = req.body;

    try {
        // Create user in the database with encrypted data
        const result = await createUser({
            name: encryptedName,
            email: encryptedEmail,
            phone: encryptedPhone,
            country: encryptedCountry,
            latitude: encryptedLatitude,
            longitude: encryptedLongitude,
            password, // Hashed password
            terms_accepted,
            loyalty_program_accepted,
        });

        const userId = result.recordset[0].user_id;
        res.status(201).json({ message: "User created successfully!", userId });
    } catch (error) {
        console.error("Error in createUserController:", error.message);
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
};

module.exports = { createUserController };
