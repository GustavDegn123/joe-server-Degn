// Importerer bcrypt til at sammenligne passwords
const bcrypt = require("bcrypt");

// Importerer jsonwebtoken til at oprette JWT'er
const jwt = require("jsonwebtoken");

// Importerer dekrypteringslogik
const { decryptWithPrivateKey } = require("./asymmetricController");

// Importerer databaseforbindelsen
const { getConnection } = require("../../config/db");

// Funktion til login-håndtering
const loginController = async (req, res) => {
    // Henter email og password fra forespørgsels-body
    const { email, password } = req.body;

    try {
        // Opretter forbindelse til databasen
        const pool = await getConnection();

        // Henter alle brugere fra databasen
        const result = await pool.request().query("SELECT * FROM Users");
        const users = result.recordset;

        // Finder brugeren ved at dekryptere og matche emailen
        const user = users.find((user) => {
            try {
                const decryptedEmail = decryptWithPrivateKey(user.email); // Dekrypterer emailen
                return decryptedEmail === email; // Tjekker om email matcher
            } catch (error) {
                console.error(`Fejl ved dekryptering af email for user_id ${user.user_id}:`, error.message);
                return false; // Returnerer false ved fejl
            }
        });

        // Returnerer en fejl, hvis brugeren ikke findes
        if (!user) {
            return res.status(401).json({ message: "Ugyldig email eller password" });
        }

        // Verificerer brugerens password
        const passwordMatch = await bcrypt.compare(password, user.hashed_password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Ugyldig email eller password" });
        }

        // Opretter en JWT-token med brugerens ID som payload
        const token = jwt.sign(
            { userId: user.user_id }, // Indsætter kun brugerens ID i token-payload
            process.env.JWT_SECRET, // Bruger den hemmelige nøgle fra miljøvariabler
            { expiresIn: "1h" } // Sætter token til at udløbe efter 1 time
        );

        // Indstiller en cookie med token
        res.cookie("jwt", token, {
            httpOnly: false, // Tillader JavaScript at tilgå cookien
            secure: process.env.NODE_ENV === "production", // Gør cookien sikker i produktionsmiljø
            maxAge: 3600000, // Cookieens levetid i millisekunder (1 time)
            sameSite: "Lax", // Beskytter mod CSRF-angreb
        });

        // Returnerer succesrespons med besked og token
        res.status(200).json({ message: "Login succesfuldt", token });
    } catch (error) {
        // Logger fejl og returnerer en serverfejlrespons
        console.error("Fejl under login:", error.message);
        res.status(500).json({ message: "Intern serverfejl", error: error.message });
    }
};

// Eksporterer login-controlleren, så den kan bruges i andre dele af applikationen
module.exports = { loginController };
