const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decryptWithPrivateKey } = require("./asymmetricController");
const { getConnection } = require("../../config/db");

const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await getConnection();

        // Fetch all users from the database
        const result = await pool.request().query("SELECT * FROM Users");
        const users = result.recordset;

        // Decrypt stored emails and find the matching one
        const user = users.find((user) => {
            try {
                const decryptedEmail = decryptWithPrivateKey(user.email);
                return decryptedEmail === email;
            } catch (error) {
                console.error(`Error decrypting email for user_id ${user.user_id}:`, error.message);
                return false;
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.hashed_password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.user_id }, // Only store user_id in the JWT payload
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set the cookie with the token
        res.cookie("jwt", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production", // Secure in production
            maxAge: 3600000, // 1 hour in milliseconds
            sameSite: "Lax", // Prevent CSRF on cross-site requests
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { loginController };
