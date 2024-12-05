// Importerer jsonwebtoken-biblioteket
const jwt = require('jsonwebtoken');

// Middleware til autentifikation
const authMiddleware = (req, res, next) => {
    try {
        // Henter JWT-token fra cookies
        const token = req.cookies.jwt; // Antager, at JWT er gemt i en cookie

        // Tjekker om token eksisterer
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" }); // Returnerer en 401-fejl, hvis der ikke er noget token
        }

        // Verificerer JWT-tokenet
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Bruger en hemmelig nøgle til at verificere tokenet

        // Vedhæfter bruger-ID fra det dekodede token til forespørgslens objekt
        req.userId = decoded.userId;

        // Kalder næste middleware eller route-handler
        next();
    } catch (error) {
        // Logger fejl og returnerer en 401-fejl ved ugyldigt token
        console.error("Fejl ved JWT-verifikation:", error.message);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

// Eksporterer middleware-funktionen, så den kan bruges i andre dele af applikationen
module.exports = authMiddleware;
