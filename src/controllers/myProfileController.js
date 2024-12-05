// Importerer funktioner til at hente og opdatere brugerens profil
const { getUserLoyaltyCardData, updateUserProfile } = require('../models/myProfileModel');

// Importerer dekrypteringslogik
const { decryptWithPrivateKey } = require('./asymmetricController');

// Funktion til at hente data for brugerens loyalitetskort
exports.getLoyaltyCardData = async (req, res) => {
    // Henter brugerens ID fra forespørgselsobjektet
    const userId = req.userId;
    if (!userId) {
        // Returnerer en fejl, hvis bruger-ID mangler
        return res.status(400).json({ message: "Bruger-ID ikke fundet" });
    }

    try {
        // Henter brugerdata baseret på bruger-ID
        const userData = await getUserLoyaltyCardData(userId);

        if (userData) {
            try {
                // Dekrypterer email, før den sendes som svar
                userData.email = decryptWithPrivateKey(userData.email);
            } catch (error) {
                // Logger fejl og returnerer en serverfejl, hvis dekrypteringen mislykkes
                console.error(`Fejl ved dekryptering af email for user_id ${userId}:`, error.message);
                return res.status(500).json({ message: "Fejl ved dekryptering af email" });
            }

            // Returnerer brugerdata som JSON-svar
            res.status(200).json(userData);
        } else {
            // Returnerer en 404-fejl, hvis brugeren ikke findes
            res.status(404).json({ message: "Bruger ikke fundet" });
        }
    } catch (error) {
        // Logger fejl og returnerer en serverfejl
        console.error("Fejl ved hentning af loyalitetskortdata:", error);
        res.status(500).json({ message: "Serverfejl" });
    }
};

// Funktion til at opdatere brugerens profil
exports.updateUserProfile = async (req, res) => {
    // Henter bruger-ID fra forespørgselsobjektet
    const userId = req.userId;

    // Henter profiloplysninger fra forespørgsels-body
    const { name, email, phone_number, country, password } = req.body;

    try {
        // Opdaterer brugerens profil i databasen
        await updateUserProfile(userId, { name, email, phone_number, country, password });

        // Returnerer en succesbesked som JSON
        res.status(200).json({ message: "Profil opdateret succesfuldt" });
    } catch (error) {
        // Logger fejl og returnerer en serverfejl
        console.error("Fejl ved opdatering af profil:", error);
        res.status(500).json({ message: "Serverfejl" });
    }
};