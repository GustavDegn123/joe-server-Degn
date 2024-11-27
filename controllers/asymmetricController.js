const crypto = require('crypto');
const { privateKey, publicKey } = require('../config/cryptoConfig'); // Import from config

// Encrypt with public key
function encryptWithPublicKey(data) {
    return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
}

// Decrypt with private key
function decryptWithPrivateKey(encryptedData) {
    return crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64')).toString('utf8');
}

module.exports = { encryptWithPublicKey, decryptWithPrivateKey };
