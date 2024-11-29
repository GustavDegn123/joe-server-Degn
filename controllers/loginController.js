const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../config/db");
const { decryptWithPrivateKey } = require("../controllers/asymmetricController");

const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await getConnection();

        // Fetch all users from the database
        const result = await pool.request().query("SELECT * FROM Users");
        const users = result.recordset;

        // Decrypt each stored email and compare with input email
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

        // Generate a JWT token
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error.message, error.stack);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { loginController };
