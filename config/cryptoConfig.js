// Indlæser miljøvariabler fra .env filen
require('dotenv').config();

// Initialiserer variabler til RSA private og public keys
let privateKey;
let publicKey;

try {
    // Tjekker om både private og public keys er defineret i miljøvariabler
    if (process.env.PRIVATE_KEY && process.env.PUBLIC_KEY) {
        // Decodes private og public keys fra base64-strenge og konverterer dem til UTF-8
        privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('utf8');
        publicKey = Buffer.from(process.env.PUBLIC_KEY, 'base64').toString('utf8');
    } else {
        // Kaster fejl, hvis RSA keys ikke er korrekt konfigureret i .env filen
        throw new Error('RSA keys are not properly configured in .env');
    }
} catch (error) {
    // Logger fejl, hvis der opstår problemer med at indlæse RSA keys
    console.error('Fejl ved indlæsning af RSA keys:', error.message);
    // Kaster en ny fejl med beskrivelsen af problemet
    throw new Error('RSA keys are missing or could not be loaded');
}

// Eksporterer private og public keys, så de kan bruges i andre filer
module.exports = {
    privateKey,
    publicKey,
};