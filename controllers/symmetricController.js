const crypto = require('crypto');
const { symmetricKey } = require('../config/cryptoConfig');

// Encrypt data using AES (symmetric encryption)
function encryptData(data) {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(symmetricKey, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
}

// Decrypt data using AES (symmetric decryption)
function decryptData(encryptedData, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(symmetricKey, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encryptData, decryptData };
