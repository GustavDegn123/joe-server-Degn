const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../models/userModel");
const bcrypt = require("bcrypt");

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Fetch the user from the database
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT with user_id and optional metadata
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token as a cookie
    res.cookie("jwt", token, {
      httpOnly: true, // Secure the cookie from client-side scripts
      secure: process.env.NODE_ENV === "production", // Secure only in production
      maxAge: 3600000, // 1 hour in milliseconds
      sameSite: "Lax", // Protect against CSRF
    });

    // Send success response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  loginController,
};
