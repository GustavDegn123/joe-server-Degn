// Importerer databaseforbindelsen
const { poolPromise, sql } = require('../../config/db');

// Importerer bcrypt til at hash'e passwords
const bcrypt = require('bcrypt');

// Importerer funktionen til at kryptere data med en offentlig nøgle
const { encryptWithPublicKey } = require('../controllers/asymmetricController');

// Definerer antallet af salt-runder til hashing
const saltRounds = 10;

// Funktion til at oprette en ny bruger i databasen
const createUser = async (userData) => {
    console.log('Opretter bruger i databasen:', userData);

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

        // Genbruger poolforbindelsen
        const pool = await poolPromise;

        // Indsætter brugerens data i databasen
        const result = await pool
            .request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('phone_number', sql.NVarChar, phone)
            .input('country', sql.NVarChar, country)
            .input('hashed_password', sql.NVarChar, hashedPassword)
            .input('loyalty_points', sql.Int, 0) // Sætter standardværdi for loyalitetspoint
            .input('terms_accepted', sql.Bit, terms_accepted)
            .input('loyalty_program_accepted', sql.Bit, loyalty_program_accepted)
            .input('latitude', sql.Float, latitude)
            .input('longitude', sql.Float, longitude)
            .query(`
                INSERT INTO Users (name, email, phone_number, country, hashed_password, loyalty_points, terms_accepted, loyalty_program_accepted, latitude, longitude)
                OUTPUT INSERTED.user_id
                VALUES (@name, @email, @phone_number, @country, @hashed_password, @loyalty_points, @terms_accepted, @loyalty_program_accepted, @latitude, @longitude)
            `);

        console.log('Bruger oprettet succesfuldt:', result);
        return result; // Returnerer resultatet for videre brug
    } catch (error) {
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

        // Genbruger poolforbindelsen
        const pool = await poolPromise;

        // Opdaterer brugerens email i databasen
        await pool
            .request()
            .input('user_id', sql.Int, userId)
            .input('encryptedEmail', sql.NVarChar, encryptedEmail)
            .query(`
                UPDATE Users
                SET email = @encryptedEmail
                WHERE user_id = @user_id
            `);

        console.log(`Email krypteret og opdateret for bruger ${userId}`);
    } catch (error) {
        console.error('Fejl ved kryptering og opdatering af email:', error);
        throw error;
    }
};

// Funktion til at opdatere brugerens loyalitetspoint i databasen
const updateUserLoyaltyPoints = async (userId, pointsToAdd) => {
    try {
        // Genbruger poolforbindelsen
        const pool = await poolPromise;

        // Opdaterer brugerens loyalitetspoint
        const result = await pool
            .request()
            .input('user_id', sql.Int, userId)
            .input('pointsToAdd', sql.Int, pointsToAdd)
            .query(`
                UPDATE Users
                SET loyalty_points = loyalty_points + @pointsToAdd
                WHERE user_id = @user_id
            `);

        console.log(`Loyalitetspoint opdateret for bruger ${userId}. Point tilføjet: ${pointsToAdd}`);
        return result;
    } catch (error) {
        console.error('Fejl ved opdatering af loyalitetspoint:', error);
        throw error;
    }
};

// Funktion til at hente en bruger fra databasen baseret på email
const getUserByEmail = async (email) => {
    // Genbruger poolforbindelsen
    const pool = await poolPromise;

    // Henter brugeren baseret på email
    const result = await pool
        .request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');

    return result.recordset[0];
};

// Eksporterer funktionerne, så de kan bruges i andre dele af applikationen
module.exports = {
    createUser,
    encryptAndSaveEmail,
    updateUserLoyaltyPoints,
    getUserByEmail,
};
