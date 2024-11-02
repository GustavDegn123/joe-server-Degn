const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../models/userModel"); // Example function to fetch user from DB
const bcrypt = require("bcrypt");

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the user from database (this is just a placeholder, replace with actual logic)
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email }, // Include user-specific claims
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

    // Store JWT in a secure, HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      maxAge: 3600000, // 1 hour
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  loginController,
};
