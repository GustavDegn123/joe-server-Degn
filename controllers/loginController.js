const { getUserByEmail } = require('../models/userModel');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user from the database
        const user = await getUserByEmail(email);
        console.log("Fetched user:", user); // Debugging line
        if (!user) {
            return res.status(404).json({ message: 'Bruger ikke fundet' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Forkert adgangskode' });
        }

        res.status(200).json({ message: 'Login vellykket', user: { id: user.user_id, name: user.name } });
    } catch (error) {
        console.error("Login fejlede:", error);
        res.status(500).json({ message: 'Login fejlede', error });
    }
};

module.exports = { loginController };
