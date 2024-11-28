const { createUser, updateUserLoyaltyPoints, encryptAndSaveEmail } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');
const { sendSms } = require('./twilioService');

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
        longitude,
    } = req.body;

    try {
        console.log('Creating user with data:', req.body);

        // Create the user and get the userId
        const result = await createUser({
            name,
            email,
            phone,
            password,
            terms_accepted,
            loyalty_program_accepted,
            country,
            latitude,
            longitude,
        });

        const userId = result.recordset[0].user_id;
        console.log('New user ID:', userId);

        // Add 1000 loyalty points
        await updateUserLoyaltyPoints(userId, 1000);

        // Send welcome email
        await sendWelcomeEmail({ id: userId, name, email });

        // Encrypt email and update in the database
        await encryptAndSaveEmail(userId, email);

        // Send SMS notification
        const smsMessage = `Hej ${name}, velkommen til vores loyalitetsprogram! Du har fået 1000 velkomstpoint.`;
        await sendSms(phone, smsMessage);

        res.status(201).json({ message: 'Bruger oprettet og email krypteret!', userId });
    } catch (error) {
        console.error('Error in createUserController:', error.message, error.stack);
        res.status(500).json({ message: 'Kunne ikke oprette bruger', error: error.message });
    }
};

module.exports = { createUserController };
