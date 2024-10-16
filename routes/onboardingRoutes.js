const express = require("express");
const router = express.Router();
const onboardingController = require("../controllers/onboardingController");


// Definer GET-ruten for onboarding-status
router.get("/:userId", onboardingController.getOnboardingStatus);
// POST-rute til at opdatere onboarding-trin
router.post("/completeStep", onboardingController.completeStep);

module.exports = router;
