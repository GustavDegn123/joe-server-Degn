// Importerer databaseforbindelsen
const { getConnection } = require('../../config/db');

// Importerer bcrypt til at hash'e passwords
const bcrypt = require("bcrypt");

// Importerer funktionen til at kryptere data med en offentlig nøgle
const { encryptWithPublicKey } = require('../controllers/asymmetricController');

// Funktion til at hente brugerdata til loyalitetskort
const getUserLoyaltyCardData = async (userId) => {
    // Opretter forbindelse til databasen
    const pool = await getConnection();

    // Udfører en forespørgsel, der henter brugeroplysninger og ordreantal i én forespørgsel
    const result = await pool.request()
        .input('user_id', userId)
        .query(`
            SELECT u.user_id, u.name, u.email, u.phone_number, u.country, u.loyalty_points,
                   (SELECT COUNT(*) FROM Orders WHERE user_id = @user_id) AS total_orders
            FROM Users u
            WHERE u.user_id = @user_id
        `);

    // Returnerer den første række med brugerdata
    return result.recordset[0];
};

// Funktion til at opdatere brugerens profil
const updateUserProfile = async (userId, { name, email, phone_number, country, password }) => {
    // Opretter forbindelse til databasen
    const pool = await getConnection();

    // Opretter en forespørgsel og binder bruger-ID
    const request = pool.request().input('user_id', userId);

    // Krypterer emailen før opdatering
    let encryptedEmail;
    try {
        encryptedEmail = encryptWithPublicKey(email); // Krypter email med en offentlig nøgle
    } catch (error) {
        console.error("Fejl ved kryptering af email:", error.message);
        throw error;
    }

    // Binder de øvrige inputværdier
    request.input('name', name)
        .input('email', encryptedEmail) // Bruger den krypterede email
        .input('phone_number', phone_number)
        .input('country', country);

    // Hvis der gives et nyt password, hash'es det før opdatering
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        request.input('hashed_password', hashedPassword);
    }

    // Udfører en forespørgsel for at opdatere brugerens profil i databasen
    await request.query(`
        UPDATE Users 
        SET 
            name = @name, 
            email = @email, 
            phone_number = @phone_number, 
            country = @country
            ${password ? ", hashed_password = @hashed_password" : ""} 
        WHERE user_id = @user_id
    `);
};

// Eksporterer funktionerne, så de kan bruges i andre dele af applikationen
module.exports = { getUserLoyaltyCardData, updateUserProfile };
