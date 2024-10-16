const onboardingModel = require("../models/onboardingModel"); // Importer modellen

// Controller-funktion til at hente onboarding-status for en bruger baseret på userId
exports.getOnboardingStatus = async (req, res) => {
    const userId = req.params.userId; // Hent userId fra URL'en

    try {
        // Brug modellen til at hente onboarding-status fra databasen
        const result = await onboardingModel.getOnboardingStatus(userId);
        res.json(result); // Returner resultaterne som JSON

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching onboarding status" });
    }
};

// Controller-funktion til at opdatere onboarding-trin
exports.completeStep = async (req, res) => {
    const { user_id, step_number, step_description, completed_at } = req.body; // Hent data fra request body

    if (!user_id || !step_number || !step_description || !completed_at) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Brug modellen til at opdatere trinnet
        await onboardingModel.completeStep(user_id, step_number, step_description, completed_at);
        res.status(201).json({ message: "Step completed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error completing onboarding step" });
    }
};
