const crypto = require('crypto');
const { privateKey, publicKey } = require('../config/cryptoConfig'); // Import keys from config

// Create signature
function signData(data) {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(data);
    signer.end();
    return signer.sign(privateKey, 'base64');
}

// Verify signature
function verifySignature(data, signature) {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(data);
    verifier.end();
    return verifier.verify(publicKey, signature, 'base64');
}

module.exports = { signData, verifySignature };
