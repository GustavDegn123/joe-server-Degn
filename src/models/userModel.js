// Importerer databaseforbindelsen
const { getConnection } = require('../../config/db');

// Importerer bcrypt til at hash'e passwords
const bcrypt = require('bcrypt');

// Importerer funktionen til at kryptere data med en offentlig nøgle
const { encryptWithPublicKey } = require('../controllers/asymmetricController');

// Definerer antallet af salt-runder til hashing
const saltRounds = 10;

// Funktion til at oprette en ny bruger i databasen
const createUser = async (userData) => {
    console.log('Opretter bruger i databasen:', userData);

    // Destrukturerer de nødvendige data fra brugerens input
    const {
        name,
        email,
        phone,
        country,
        password,
        terms_accepted,
        loyalty_program_accepted,
        latitude,
        longitude,
    } = userData;

    try {
        // Hash'er brugerens password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Henter en forbindelse til databasen
        const pool = await getConnection();

        // Indsætter brugerens data i databasen
        const result = await pool
            .request()
            .input('name', name)
            .input('email', email)
            .input('phone_number', phone)
            .input('country', country)
            .input('hashed_password', hashedPassword)
            .input('loyalty_points', 0) // Sætter standardværdi for loyalitetspoint
            .input('terms_accepted', terms_accepted)
            .input('loyalty_program_accepted', loyalty_program_accepted)
            .input('latitude', latitude)
            .input('longitude', longitude)
            .query(
                `
                INSERT INTO Users (name, email, phone_number, country, hashed_password, loyalty_points, terms_accepted, loyalty_program_accepted, latitude, longitude)
                OUTPUT INSERTED.user_id
                VALUES (@name, @email, @phone_number, @country, @hashed_password, @loyalty_points, @terms_accepted, @loyalty_program_accepted, @latitude, @longitude)
            `
            );

        console.log('Bruger oprettet succesfuldt:', result);
        return result; // Returnerer resultatet for videre brug
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved oprettelse af bruger:', error);
        throw error;
    }
};

// Funktion til at kryptere en email og opdatere den i databasen
const encryptAndSaveEmail = async (userId, email) => {
    try {
        // Krypterer email med en offentlig nøgle
        const encryptedEmail = encryptWithPublicKey(email);
        console.log('Krypteret email:', encryptedEmail);

        // Henter en forbindelse til databasen
        const pool = await getConnection();

        // Opdaterer brugerens email i databasen
        await pool
            .request()
            .input('user_id', userId)
            .input('encryptedEmail', encryptedEmail)
            .query(`
                UPDATE Users
                SET email = @encryptedEmail
                WHERE user_id = @user_id
            `);

        console.log(`Email krypteret og opdateret for bruger ${userId}`);
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved kryptering og opdatering af email:', error);
        throw error;
    }
};

// Funktion til at opdatere brugerens loyalitetspoint i databasen
const updateUserLoyaltyPoints = async (userId, pointsToAdd) => {
    try {
        // Henter en forbindelse til databasen
        const pool = await getConnection();

        // Opdaterer brugerens loyalitetspoint
        const result = await pool
            .request()
            .input('user_id', userId)
            .input('pointsToAdd', pointsToAdd)
            .query(`
                UPDATE Users
                SET loyalty_points = loyalty_points + @pointsToAdd
                WHERE user_id = @user_id
            `);

        console.log(`Loyalitetspoint opdateret for bruger ${userId}. Point tilføjet: ${pointsToAdd}`);
        return result;
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved opdatering af loyalitetspoint:', error);
        throw error;
    }
};

// Funktion til at hente en bruger fra databasen baseret på email
const getUserByEmail = async (email) => {
    // Henter en forbindelse til databasen
    const pool = await getConnection();

    // Henter brugeren baseret på email
    const result = await pool
        .request()
        .input('email', email)
        .query('SELECT * FROM Users WHERE email = @email');

    // Returnerer den fundne brugerpost
    return result.recordset[0];
};

// Eksporterer funktionerne, så de kan bruges i andre dele af applikationen
module.exports = {
    createUser,
    encryptAndSaveEmail,
    updateUserLoyaltyPoints,
    getUserByEmail
};
