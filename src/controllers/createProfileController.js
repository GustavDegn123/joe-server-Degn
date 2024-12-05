// Importerer nødvendige funktioner og tjenester
const { createUser, updateUserLoyaltyPoints, encryptAndSaveEmail } = require('../models/userModel');
const { sendWelcomeEmail } = require('./emailController');
const { sendSms } = require('./twilioService');

// Controller til at oprette en ny bruger
const createUserController = async (req, res) => {
    // Henter data fra forespørgsels-body
    const {
        name,
        email,
        phone,
        password,
        terms_accepted,
        loyalty_program_accepted,
        country,
        latitude,
        longitude,
    } = req.body;

    try {
        console.log('Opretter bruger med følgende data:', req.body);

        // Opretter brugeren og modtager bruger-ID
        const result = await createUser({
            name,
            email,
            phone,
            password,
            terms_accepted,
            loyalty_program_accepted,
            country,
            latitude,
            longitude,
        });

        // Henter bruger-ID fra resultatet af databaseforespørgslen
        const userId = result.recordset[0].user_id;
        console.log('Ny bruger-ID:', userId);

        // Tilføjer 1000 loyalitetspoint som velkomstbonus
        await updateUserLoyaltyPoints(userId, 1000);

        // Sender velkomst-e-mail til brugeren
        await sendWelcomeEmail({ id: userId, name, email });

        // Krypterer email og opdaterer den i databasen
        await encryptAndSaveEmail(userId, email);

        // Sender SMS-besked som notifikation til brugeren
        const smsMessage = `Hej ${name}, velkommen til vores loyalitetsprogram! Du har fået 1000 velkomstpoint.`;
        await sendSms(phone, smsMessage);

        // Returnerer en succesrespons
        res.status(201).json({ message: 'Bruger oprettet og email krypteret!', userId });
    } catch (error) {
        // Logger fejl og returnerer en serverfejlrespons
        console.error('Fejl i createUserController:', error.message, error.stack);
        res.status(500).json({ message: 'Kunne ikke oprette bruger', error: error.message });
    }
};

// Eksporterer controlleren, så den kan bruges i andre dele af applikationen
module.exports = { createUserController };