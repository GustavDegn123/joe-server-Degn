// controllers/loginController.js
const { getUserByEmail } = require('../models/userModel');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hent bruger fra databasen
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Bruger ikke fundet' });
        }

        // Tjek adgangskode
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Forkert adgangskode' });
        }

        // Opret session
        req.session.userId = user.user_id;
        req.session.userName = user.name;
        res.cookie('userName', user.name, { maxAge: 86400000 });  // Sætter cookie

        res.status(200).json({ message: 'Login vellykket', user: { id: user.user_id, name: user.name } });
    } catch (error) {
        console.error("Login fejlede:", error);
        res.status(500).json({ message: 'Login fejlede', error });
    }
};

module.exports = { loginController };
