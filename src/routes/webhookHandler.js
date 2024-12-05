// Importerer Stripe biblioteket med hemmelig nøgle
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Importerer funktioner til opdatering af ordrestatus og hentning af brugerdata
const { updateOrderStatus, getUserById } = require('../models/orderModel');

// Importerer funktion til at sende ordrebekræftelsesemails
const sendOrderConfirmation = require('../controllers/confirmationController');

// Importerer funktion til dekryptering med privat nøgle
const { decryptWithPrivateKey } = require('../controllers/asymmetricController');

// Håndterer Stripe-webhooken
const handleStripeWebhook = async (req, res) => {
    // Henter Stripe-signaturen fra headers og webhook-secret fra miljøvariabler
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        let event;

        // I testmiljø springes signaturverifikation over
        if (process.env.NODE_ENV === 'test') {
            event = req.body;
            console.log("Kører i testtilstand, signaturverifikation springes over.");
        } else {
            // Verificerer signaturen fra Stripe-webhooken
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Signaturen er verificeret.");
        }

        // Håndterer begivenheden 'checkout.session.completed'
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Logger metadata fra Stripe-webhooken
            console.log('Modtaget metadata fra Stripe-webhook:', session.metadata);

            // Henter ordre-ID fra metadata
            const orderId = session.metadata?.orderId;

            // Tjekker om ordre-ID findes i metadata
            if (!orderId) {
                console.error("Ordre-ID mangler i metadata.");
                return res.status(400).send('Ordre-ID er påkrævet.');
            }

            // Opdaterer ordrestatus i databasen
            await updateOrderStatus(orderId, 'completed');
            console.log(`Ordre ${orderId} status opdateret til completed.`);

            // Forbereder ordreoplysninger til email
            const orderDetails = `
                <p><strong>Ordre-ID:</strong> ${orderId}</p>
                <p><strong>Totalpris:</strong> ${(session.amount_total / 100).toFixed(2)} DKK</p>
                <p><strong>Betalingsmetode:</strong> ${session.payment_method_types[0]}</p>
                <p><strong>Ordredato:</strong> ${new Date().toLocaleString()}</p>
            `;

            // Tjekker efter email i Stripe-sessionen
            let emailToUse = session.customer_details?.email;

            // Hvis email ikke findes i sessionen, hentes brugerdata fra databasen
            if (!emailToUse) {
                const userId = session.metadata?.userId;
                if (userId) {
                    const user = await getUserById(userId);

                    // Forsøger at dekryptere brugerens email
                    try {
                        emailToUse = decryptWithPrivateKey(user.email);
                    } catch (error) {
                        console.error(`Fejl ved dekryptering af email for bruger-ID ${userId}:`, error.message);
                        throw error;
                    }
                }
            }

            // Sender ordrebekræftelse, hvis en gyldig email findes
            if (emailToUse) {
                await sendOrderConfirmation(emailToUse, orderDetails, session.metadata?.userId);
                console.log("Ordrebekræftelsesmail sendt succesfuldt.");
            } else {
                console.error("Ingen gyldig emailadresse tilgængelig til at sende bekræftelse.");
            }

            // Sender en succesrespons til Stripe
            res.status(200).send('Webhook modtaget og behandlet.');
        } else {
            // Logger hvis begivenhedstypen ikke håndteres
            console.log("Uhåndteret begivenhedstype:", event.type);
            res.status(400).send('Uhåndteret begivenhedstype');
        }
    } catch (error) {
        // Logger fejl og sender fejlrespons
        console.error('Webhook-fejl:', error.message);
        res.status(400).send(`Webhook-fejl: ${error.message}`);
    }
};

// Eksporterer funktionen som modul
module.exports = handleStripeWebhook;
