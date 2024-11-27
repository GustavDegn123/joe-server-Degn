const { createUser } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');
const { sendSms } = require('./twilioService'); // Import the Twilio SMS service

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
        // Create user in the database
        const result = await createUser({
            name,
            email,
            phone,
            password,
            terms_accepted,
            loyalty_program_accepted,
            country,
            latitude,
            longitude
        });

        const userId = result.recordset[0].user_id;
        console.log("New user ID:", userId);

        // Send welcome email
        await sendWelcomeEmail({ id: userId, name, email });

        // Send SMS notification
        const smsMessage = `Hej ${name}, velkommen til vores loyalitetsprogram!`;
        await sendSms(phone, smsMessage);

        res.status(201).json({ message: "Bruger oprettet og SMS sendt!", userId });
    } catch (error) {
        console.error('Error in createUserController:', error.message);
        res.status(500).json({ message: "Kunne ikke oprette bruger", error: error.message });
    }
};

module.exports = { createUserController };
