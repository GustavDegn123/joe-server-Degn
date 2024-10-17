const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require('http'); // To perform HTTP requests to measure RTT

const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON in POST requests
app.use(express.json()); // Ensures that we can receive JSON-formatted data in API requests

// Serve static files from the "public" folder (for images, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from the public folder

// Route for the homepage (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve the index.html file
});

// Test route to return a simple message (used for RTT measurements)
app.get("/res", (req, res) => {
  res.send("Server response message"); // Return a simple text message
});

// RTT ping route to measure RTT
app.get('/ping', (req, res) => {
  const serverTime = Date.now();  // Capture server time when request is received
  res.json({ message: 'pong', serverTime });
});

// Import routes for users, onboarding, and feedback from external files
const userRoutes = require("./routes/userRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Use user routes
app.use("/api/users", userRoutes);

// Use onboarding routes
app.use("/api/onboarding", onboardingRoutes);

// Use feedback routes
app.use("/api/feedback", feedbackRoutes);

// Start the server and listen on port 3000
const server = app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// Set a timeout on the server (e.g., 5 seconds)
server.setTimeout(5000);

// Function to measure HTTP request-response RTT (commented out by default)
/*
function measureRequestResponseRTT() {
    const reqStart = Date.now();

    const options = {
        host: 'localhost',
        port: 3000,
        path: '/res',
        agent: new http.Agent({ keepAlive: true })
    };

    http.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const reqDuration = Date.now() - reqStart;
            console.log(`HTTP RTT: ${reqDuration} ms`);
        });

    }).on('error', (err) => {
        console.error(`HTTP request failed: ${err.message}`);
    });
}

// Run RTT measurement every 5 seconds (commented out)
/*
setInterval(measureRequestResponseRTT, 5000);
*/
