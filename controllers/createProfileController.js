const { createUser } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');
const { sendSms } = require('./twilioService'); // Import the Twilio SMS service
const { decryptData } = require('./asymmetricController'); // Import asymmetric decryption

const createUserController = async (req, res) => {
    const {
        name,
        email,
        phone,
        password,
        terms_accepted,
        loyalty_program_accepted,
        country,
        latitude,
        longitude
    } = req.body;

    try {
        // Decrypt the sensitive data
        const decryptedData = await decryptData({
            name,
            email,
            phone,
            country,
            latitude,
            longitude
        });

        // Create user in the database with decrypted data
        const result = await createUser({
            ...decryptedData,
            password, // Hashed password
            terms_accepted,
            loyalty_program_accepted
        });

        const userId = result.recordset[0].user_id;
        console.log("New user ID:", userId);

        // Send welcome email
        await sendWelcomeEmail({ id: userId, name: decryptedData.name, email: decryptedData.email });

        // Send SMS notification
        const smsMessage = `Hej ${decryptedData.name}, velkommen til vores loyalitetsprogram!`;
        await sendSms(decryptedData.phone, smsMessage);

        res.status(201).json({ message: "Bruger oprettet og SMS sendt!", userId });
    } catch (error) {
        console.error('Error in createUserController:', error.message);
        res.status(500).json({ message: "Kunne ikke oprette bruger", error: error.message });
    }
};

module.exports = { createUserController };
