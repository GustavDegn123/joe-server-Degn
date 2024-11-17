const { createUser } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');
const { sendSms } = require('./twilioService'); // Import the Twilio SMS service

const createUserController = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Step 1: Create the user in the database
        const result = await createUser({ name, email, phone, password });
        const userId = result.recordset[0].user_id; // Get user_id from the result
        const user = { id: userId, name, email, phone };

        // Step 2: Send a welcome email
        await sendWelcomeEmail(user);

        // Step 3: Send SMS notification
        const smsMessage = `Hej ${name}, velkommen til vores loyalitetsprogram!`;
        await sendSms(phone, smsMessage);

        // Step 4: Respond with success
        res.status(201).json({ message: 'Bruger oprettet og SMS sendt!', result });
    } catch (error) {
        console.error('Error in createUserController:', error.message);
        res.status(500).json({ message: 'Kunne ikke oprette bruger', error: error.message });
    }
};

module.exports = { createUserController };
