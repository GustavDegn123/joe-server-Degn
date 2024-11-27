const { createUser } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');
const { sendSms } = require('./twilioService');

const createUserController = async (req, res) => {
    const {
        encryptedName,
        encryptedEmail,
        encryptedPhone,
        encryptedCountry,
        encryptedLatitude,
        encryptedLongitude,
        plaintextPhone, // Unencrypted phone
        password,
        terms_accepted,
        loyalty_program_accepted,
    } = req.body;

    try {
        // Send welcome email using unencrypted data
        await sendWelcomeEmail({
            name: req.body.name, // Unencrypted name
            email: req.body.email, // Unencrypted email
            phone: plaintextPhone, // Plaintext phone
        });

        // Send SMS notification using plaintext phone
        const smsMessage = `Hej ${req.body.name}, velkommen til vores loyalitetsprogram!`;
        await sendSms(plaintextPhone, smsMessage);

        // Prepare data for database insertion
        const userData = {
            name: encryptedName, // Encrypted name
            email: encryptedEmail, // Encrypted email
            phone: encryptedPhone, // Encrypted phone
            country: encryptedCountry, // Encrypted country
            latitude: encryptedLatitude, // Encrypted latitude
            longitude: encryptedLongitude, // Encrypted longitude
            password, // Plaintext password for hashing
            terms_accepted,
            loyalty_program_accepted,
        };

        console.log("Data being sent to createUser:", userData);

        // Store encrypted data in the database
        const result = await createUser(userData);
        const userId = result.recordset[0].user_id;

        res.status(201).json({ message: "User created successfully!", userId });
    } catch (error) {
        console.error("Error in createUserController:", error.message);
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
};

module.exports = { createUserController };
