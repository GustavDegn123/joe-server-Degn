const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../models/userModel");
const { decryptWithPrivateKey } = require("../controllers/asymmetricController");

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
      const pool = await getConnection();

      // Fetch all users (use carefully if user count is high)
      const result = await pool.request().query("SELECT * FROM Users");

      // Decrypt all emails and find a match
      const user = result.recordset.find((user) => {
          const decryptedEmail = decryptWithPrivateKey(user.email);
          return decryptedEmail === email;
      });

      if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.hashed_password);
      if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: false });

      return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
      console.error("Error during login:", error.message);
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


module.exports = { loginController };
