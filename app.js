// Import dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Import custom middleware and routes
const authMiddleware = require('./src/middleware/authMiddleware');
const { getConnection } = require('./config/db'); // Ensure the config folder is outside src
const createProfileRoutes = require('./src/routes/createProfileRoutes');
const loginRoutes = require('./src/routes/loginRoutes');
const logoutRoutes = require('./src/routes/logoutRoutes');
const cloudinaryRoutes = require('./src/routes/cloudinaryRoutes');
const productRoutes = require('./src/routes/productsRoutes');
const handleStripeWebhook = require('./src/routes/webhookHandler');
const orderRoutes = require('./src/routes/orderRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const storesRoutes = require('./src/routes/storesRoutes');
const decodeRoutes = require('./src/routes/decodeRoutes');
const myProfileRoutes = require('./src/routes/myProfileRoutes');
const cryptoRoutes = require('./src/routes/cryptoRoutes');
const geolocationRoutes = require('./src/routes/geoLocationRoutes');

// Stripe logic
const { createCheckoutSession } = require('./public/scripts/stripe');

// Initialize database connection
getConnection();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', createProfileRoutes);
app.use('/api', loginRoutes);
app.use('/api', logoutRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/api', storesRoutes);
app.use('/api', decodeRoutes);
app.use('/api/profile', myProfileRoutes);
app.use('/crypto', cryptoRoutes);
app.use('/api/geoLocation', geolocationRoutes);

// Stripe webhook route
app.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Serve HTML views
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'createProfile.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

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

app.get('/myprofile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'myprofile.html'));
});

app.get('/edit-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'editProfile.html'));
});

app.get('/orderconfirmed', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'orderConfirmed.html'));
});

// Health check route
app.get("/ping", (req, res) => {
    const serverTime = Date.now();
    res.json({ message: "Pong", serverTime });
});

// API for providing Mapbox access token
app.get('/api/mapbox-token', (req, res) => {
    res.json({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
});

// Stripe checkout session creation
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, metadata } = req.body;
        const session = await createCheckoutSession(amount, metadata);
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send(error.message);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
