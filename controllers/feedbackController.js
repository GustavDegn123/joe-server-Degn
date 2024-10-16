const feedbackModel = require("../models/feedbackModel");

// Controller-funktion til at indsende feedback
exports.submitFeedback = async (req, res) => {
    const { user_id, feedback_text } = req.body; // Hent data fra request body

    if (!user_id || !feedback_text) {
        return res.status(400).json({ message: "User ID and feedback text are required" });
    }

    try {
        // Brug modellen til at indsætte feedback i databasen
        await feedbackModel.insertFeedback(user_id, feedback_text);
        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting feedback" });
    }
};
