// Importerer nødvendige afhængigheder
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Læs miljøvariabler fra .env-filen
dotenv.config();

const app = express();

// Importerer custom middleware og routere
const authMiddleware = require('./src/middleware/authMiddleware');
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

// Importerer Stripe-logik
const { createCheckoutSession } = require('./public/scripts/stripe');

// Middleware til håndtering af CORS, JSON, og cookies
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serverer statiske filer fra mappen 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Tilføjer API-routere
app.use('/api', createProfileRoutes);
app.use('/api', loginRoutes);
app.use('/api', logoutRoutes);
app.use('/api/products', authMiddleware, productRoutes); // Beskyttet med middleware
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/api', storesRoutes);
app.use('/api', decodeRoutes);
app.use('/api/profile', myProfileRoutes);
app.use('/crypto', cryptoRoutes);
app.use('/api/geoLocation', geolocationRoutes);

// Håndtering af Stripe-webhook
app.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Serverer HTML-sider
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

// Health check-endpoint for at teste serverstatus
app.get("/ping", (req, res) => {
    const serverTime = Date.now();
    res.json({ message: "Pong", serverTime });
});

// Endpoint til at levere Mapbox Access Token
app.get('/api/mapbox-token', (req, res) => {
    res.json({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
});

// Endpoint til at oprette en Stripe Checkout-session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, metadata } = req.body;
        const session = await createCheckoutSession(amount, metadata);
        res.json({ id: session.id });
    } catch (error) {
        console.error('Fejl ved oprettelse af checkout-session:', error);
        res.status(500).send(error.message);
    }
});

// Starter serveren på angivet port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server kører på port ${PORT}`);
});
