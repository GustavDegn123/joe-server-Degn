// loginController.js
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../models/userModel');  // Importer funktionen korrekt

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);  // Brug funktionen til at hente brugeren
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.hashed_password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ message: 'Error during authentication', error });
    }
};

module.exports = { loginUser };
