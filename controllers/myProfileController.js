const { getUserLoyaltyCardData, updateUserProfile } = require('../models/myProfileModel');

exports.getLoyaltyCardData = async (req, res) => {
    const userId = req.userId; // Directly access userId from req
    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }

    try {
        const userData = await getUserLoyaltyCardData(userId);
        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching loyalty card data:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Function to update profile information
exports.updateUserProfile = async (req, res) => {
    const userId = req.userId;
    const { name, email, phone_number, country, password } = req.body;

    try {
        await updateUserProfile(userId, { name, email, phone_number, country, password });
        res.status(200).json({ message: "Profile updated successfully" }); // Send JSON response only
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};