// Importerer Node.js' indbyggede crypto-bibliotek til kryptering og dekryptering
const crypto = require('crypto');

// Importerer private og public keys fra konfigurationsfilen
const { privateKey, publicKey } = require('../../config/cryptoConfig');

// Funktion til at kryptere data med den offentlige nøgle
function encryptWithPublicKey(data) {
    try {
        // Krypterer data ved hjælp af publicEncrypt og konverterer det til en base64-streng
        return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
    } catch (error) {
        // Logger fejl, hvis krypteringen mislykkes
        console.error("Krypteringsfejl:", error.message);
        throw error; // Smider fejlen videre
    }
}

// Funktion til at dekryptere data med den private nøgle
function decryptWithPrivateKey(encryptedData) {
    // Dekrypterer data ved hjælp af privateDecrypt og konverterer det tilbage til UTF-8-streng
    return crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64')).toString('utf8');
}

// Eksporterer funktionerne, så de kan bruges i andre dele af applikationen
module.exports = { encryptWithPublicKey, decryptWithPrivateKey };