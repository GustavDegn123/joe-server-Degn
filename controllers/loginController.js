const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../models/userModel");
const { decryptWithPrivateKey } = require("../controllers/asymmetricController");

const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the user by encrypted email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Decrypt the email from the database
        const decryptedEmail = decryptWithPrivateKey(user.email);
        if (decryptedEmail !== email) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.hashed_password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: false }); // Set the JWT token as an HTTP-only cookie

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { loginController };
