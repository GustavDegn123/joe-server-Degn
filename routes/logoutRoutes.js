const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    // Clear the JWT cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    });

    // Clear the basket cookie
    res.clearCookie('basket', {
        httpOnly: true, // Optional, set to true if basket cookie should be inaccessible by JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    });

    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
