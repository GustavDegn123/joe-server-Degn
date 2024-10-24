// controllers/userController.js
const { createUser } = require('../models/userModel');

const createUserController = async (req, res) => {
    const userData = req.body;

    try {
        const result = await createUser(userData);
        res.status(201).json({ message: 'User created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error });
    }
};

module.exports = { createUserController };
