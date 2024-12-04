const crypto = require('crypto');
const { privateKey, publicKey } = require('../../config/cryptoConfig'); // Import from config

function encryptWithPublicKey(data) {
    try {
        return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
    } catch (error) {
        console.error("Encryption Error:", error.message); // Log encryption errors
        throw error;
    }
}

// Decrypt with private key
function decryptWithPrivateKey(encryptedData) {
    return crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64')).toString('utf8');
}

module.exports = { encryptWithPublicKey, decryptWithPrivateKey };
