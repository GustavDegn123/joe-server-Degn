const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Symmetric key (loaded from .env file)
const symmetricKey = process.env.SYMMETRIC_KEY;

// Paths for RSA keys
const privateKeyPath = process.env.PRIVATE_KEY_PATH || path.join(__dirname, '../keys/private.pem');
const publicKeyPath = process.env.PUBLIC_KEY_PATH || path.join(__dirname, '../keys/public.pem');

// Read RSA private and public keys
let privateKey, publicKey;

try {
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    publicKey = fs.readFileSync(publicKeyPath, 'utf8');
} catch (error) {
    console.error('Error loading RSA keys:', error.message);
    throw new Error('RSA keys are missing or could not be loaded');
}

// Check symmetric key
if (!symmetricKey) {
    throw new Error('Symmetric key is not set in environment variables');
}

// Export keys and configurations
module.exports = {
    symmetricKey,
    privateKey,
    publicKey,
};
