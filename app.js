// Import dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const authMiddleware = require('./middleware/authMiddleware');
const { getConnection } = require(path.join(__dirname, 'config', 'db'));
const createProfileRoutes = require('./routes/createProfileRoutes');
const loginRoutes = require('./routes/loginRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const productRoutes = require('./routes/productsRoutes'); // Opdater stien hvis nødvendigt

getConnection();

// Middleware for CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Parse cookies
app.use('/api', createProfileRoutes);
app.use('/api', loginRoutes);
app.use('/api', logoutRoutes);
app.use('/api/products', authMiddleware, productRoutes); // This protects the /products route
app.use('/api/cloudinary', cloudinaryRoutes);

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

// Route for order-now siden
app.get('/ordernow', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'orderNow.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'checkout.html'));
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
