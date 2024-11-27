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
        plaintextPhone, // Retrieve plaintext phone for notifications
        password,
        terms_accepted,
        loyalty_program_accepted,
    } = req.body;

    try {
        // Log data for email and SMS before storing in the database
        console.log("Plaintext phone number for notifications:", plaintextPhone);

        // Send welcome email
        await sendWelcomeEmail({
            name: decryptWithPrivateKey(encryptedName), // Decrypt name
            email: decryptWithPrivateKey(encryptedEmail), // Decrypt email
            phone: plaintextPhone, // Use plaintext phone for email content
        });

        // Send SMS notification
        const smsMessage = `Hej ${decryptWithPrivateKey(encryptedName)}, velkommen til vores loyalitetsprogram!`;
        await sendSms(plaintextPhone, smsMessage);

        // Prepare data for database insertion
        const userData = {
            name: encryptedName,
            email: encryptedEmail,
            phone: encryptedPhone,
            country: encryptedCountry,
            latitude: encryptedLatitude,
            longitude: encryptedLongitude,
            password, // Hashed password
            terms_accepted,
            loyalty_program_accepted,
        };

        // Store user in database
        const result = await createUser(userData);
        const userId = result.recordset[0].user_id;

        res.status(201).json({ message: "User created successfully!", userId });
    } catch (error) {
        console.error("Error in createUserController:", error.message);
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
};

module.exports = { createUserController };
