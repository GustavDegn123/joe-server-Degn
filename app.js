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
const { createCheckoutSession } = require('./public/scripts/stripe');
const handleStripeWebhook = require('./routes/webhookHandler');
const orderRoutes = require('./routes/orderRoutes'); // Import the order routes
// const favoritesRoutes = require('./routes/favoritesRoutes');
const storesRoutes = require('./routes/storesRoutes'); // Stien inkluderer nu 'routes'-mappen

// This must be defined before `express.json()` to properly handle raw body
app.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook); // For Stripe payment confirmation

require('dotenv').config();

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
app.use('/api/orders', orderRoutes); // Register order routes under /api/orders
// app.use('/api/favorites', favoritesRoutes);
app.use('/api', storesRoutes); // Din route vil være tilgængelig på /api/stores


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

app.get('/startside', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'startside.html'));
});

app.get('/stores', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stores.html'));
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

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'orderConfirmed.html'));
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, metadata } = req.body;
        const session = await createCheckoutSession(amount, metadata); // Pass metadata to createCheckoutSession
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send(error.message);
    }
});

  
