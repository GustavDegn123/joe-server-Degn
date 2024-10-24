const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { getConnection } = require(path.join(__dirname, 'config', 'db'));
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');



getConnection();

// Middleware for CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', loginRoutes);


// Serve static files from "public" directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.get("/ping", (req, res) => {
    const serverTime = Date.now();
    res.json({ message: "Pong", serverTime }); // Respond with JSON
});

// Catch-all route to serve index.html for all paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server on port 3000
const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Set a timeout on the server (optional)
server.setTimeout(5000); // If a request takes longer than 5 seconds, it times out
