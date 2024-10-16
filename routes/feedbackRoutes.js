const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// POST-rute til at indsende feedback
router.post("/", feedbackController.submitFeedback);

module.exports = router;
