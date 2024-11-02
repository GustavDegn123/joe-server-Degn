// controllers/createProfileController.js
const { createUser } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');

const createUserController = async (req, res) => {
    const userData = req.body;

    try {
        const result = await createUser(userData);
        const userId = result.recordset[0].user_id; // Brug INSERTED.user_id fra queryen
        const user = { id: userId, ...userData };

        // Send velkomst-e-mail
        await sendWelcomeEmail(user);
        
        res.status(201).json({ message: 'Bruger oprettet og e-mail sendt', result });
    } catch (error) {
        console.error("Error in createUserController:", error);
        res.status(500).json({ message: 'Kunne ikke oprette bruger', error });
    }
};

module.exports = { createUserController };
