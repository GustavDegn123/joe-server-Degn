const userModel = require("../models/userModel");

exports.registerUser = async (req, res) => {
    const { name, email, password_hash } = req.body;
    try {
        await userModel.createUser(name, email, password_hash);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};
