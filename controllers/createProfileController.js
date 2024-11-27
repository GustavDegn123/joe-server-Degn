const { createUser } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');
const { sendSms } = require('./twilioService');
const { decryptWithPrivateKey } = require('./asymmetricController');

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
        // Decrypt data for logging and processing
        const decryptedData = {
            name: decryptWithPrivateKey(encryptedName),
            email: decryptWithPrivateKey(encryptedEmail),
            phone: decryptWithPrivateKey(encryptedPhone),
            country: decryptWithPrivateKey(encryptedCountry),
            latitude: decryptWithPrivateKey(encryptedLatitude),
            longitude: decryptWithPrivateKey(encryptedLongitude),
        };

        console.log("Decrypted Data (before email/SMS):", decryptedData);

        // Send welcome email
        await sendWelcomeEmail({
            name: decryptedData.name,
            email: decryptedData.email,
        });

        // Send SMS notification
        const smsMessage = `Hej ${decryptedData.name}, velkommen til vores loyalitetsprogram!`;
        await sendSms(decryptedData.phone, smsMessage);

        // Log encrypted data to be stored in the database
        const encryptedData = {
            name: encryptedName,
            email: encryptedEmail,
            phone: encryptedPhone,
            country: encryptedCountry,
            latitude: encryptedLatitude,
            longitude: encryptedLongitude,
        };
        console.log("Encrypted Data (stored in DB):", encryptedData);

        // Create the user in the database
        const result = await createUser({
            ...encryptedData, // Encrypted fields
            password, // Plain password for hashing
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
