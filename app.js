// Import dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { getConnection } = require(path.join(__dirname, 'config', 'db'));
const createProfileRoutes = require('./routes/createProfileRoutes');
const loginRoutes = require('./routes/loginRoutes');

getConnection();

// Middleware for CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());
app.use('/api', createProfileRoutes);
app.use('/api', loginRoutes);

// Serve static files from "public" directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the createProfile.html as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'createProfile.html'));
});

// Additional route to login page if needed
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Test route to check server health
app.get("/ping", (req, res) => {
    const serverTime = Date.now();
    res.json({ message: "Pong", serverTime });
});

// Start server on port 3000
const server = app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// Set a timeout on the server (optional)
server.setTimeout(5000); // If a request takes longer than 5 seconds, it times out
