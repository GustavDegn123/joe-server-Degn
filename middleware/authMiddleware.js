const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Assuming the JWT is stored in a cookie
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
        req.userId = decoded.userId; // Attach user ID to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("JWT verification error:", error.message);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authMiddleware;
