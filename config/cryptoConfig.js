// Load environment variables
require('dotenv').config();

// Load Symmetric Key (directly from .env)
const symmetricKey = process.env.SYMMETRIC_KEY;

if (!symmetricKey) {
    throw new Error('Symmetric key is not set in environment variables');
}

// Load RSA Private and Public Keys from Base64 Strings
let privateKey;
let publicKey;

try {
    if (process.env.PRIVATE_KEY && process.env.PUBLIC_KEY) {
        privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('utf8');
        publicKey = Buffer.from(process.env.PUBLIC_KEY, 'base64').toString('utf8');
    } else {
        throw new Error('RSA keys are not properly configured in .env');
    }
} catch (error) {
    console.error('Error loading RSA keys:', error.message);
    throw new Error('RSA keys are missing or could not be loaded');
}

// Export keys and configurations
module.exports = {
    symmetricKey,
    privateKey,
    publicKey,
};
