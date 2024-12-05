// Importerer nødvendige funktioner og modeller fra andre filer
const { getProductIdByName, createOrderWithLoyaltyPoints, getProductPointsValue, getUserById, updateUserPoints } = require('../models/orderModel');
const { createOrder } = require('../models/orderModel');
const { updateUserLoyaltyPoints } = require('../models/userModel');
const createCheckoutSession = require('../../public/scripts/stripe');
const sendOrderConfirmation = require('./confirmationController');
const { decryptWithPrivateKey } = require('./asymmetricController');

// Håndterer betaling med kort
const handlePayWithCard = async (req, res) => {
    try {
        // Henter produkter og totalbeløb fra klientens anmodning
        const { products, total } = req.body;
        const user_id = req.userId; // Henter userId fra authMiddleware

        // Indstiller totalprisen
        const total_price = total;

        // Beregner optjente point for hver vare i kurven
        let points_earned = 0;
        for (const product of products) {
            points_earned += product.unitPoints * product.quantity;
        }

        // Opretter en betalingssession via Stripe
        const session = await createCheckoutSession(total_price * 100);

        // Opretter ordredetaljer
        const orderData = {
            user_id,
            products,
            total_price,
            points_earned,
            payment_method: 'card',
            order_date: new Date()
        };

        // Opretter en ordre i databasen
        const orderId = await createOrder(orderData);

        // Opdaterer brugerens loyalitetspoint
        await updateUserLoyaltyPoints(user_id, points_earned);

        // Sender en succesrespons med sessionId og ordreId
        res.json({ sessionId: session.id, orderId });
    } catch (error) {
        // Logger fejl og sender en fejlmeddelelse som respons
        console.error('Fejl ved kortbetaling:', error.message);
        res.status(500).json({ error: 'Intern serverfejl' });
    }
};

// Håndterer betaling med loyalitetspoint
const handlePayWithLoyaltyPoints = async (req, res) => {
    // Henter bruger-ID og produkter fra klientens anmodning
    const { user_id, products } = req.body;

    try {
        // Henter brugerens nuværende loyalitetspoint fra databasen
        const user = await getUserById(user_id);
        const currentLoyaltyPoints = user.loyalty_points;

        // Beregner den samlede pris for produkterne
        const totalPrice = products.reduce((sum, product) => {
            return sum + product.quantity * product.unitPrice;
        }, 0);

        // Tjekker om brugeren har nok loyalitetspoint
        if (currentLoyaltyPoints < totalPrice) {
            return res.status(400).json({
                message: 'Ikke nok point til at fuldføre købet.',
            });
        }

        // Fratrækker point fra brugerens saldo
        const remainingPoints = currentLoyaltyPoints - totalPrice;
        await updateUserPoints(user_id, remainingPoints);

        // Opretter ordren i databasen
        const orderId = await createOrderWithLoyaltyPoints({
            user_id,
            products,
            total_price: totalPrice,
            payment_method: 'loyalty_points',
            order_date: new Date(),
        });

        // Henter opdaterede brugeroplysninger for at sende en e-mail
        const userAfterUpdate = await getUserById(user_id);

        // Dekrypterer brugerens e-mailadresse
        let decryptedEmail;
        try {
            decryptedEmail = decryptWithPrivateKey(userAfterUpdate.email);
        } catch (error) {
            console.error(`Fejl ved dekryptering af e-mail for bruger-ID ${user_id}:`, error.message);
            throw error;
        }

        // Forbereder ordreoplysninger til e-mailen
        const orderDetails = products
            .map(
                (product) =>
                    `<p>${product.quantity}x ${product.name}: ${product.unitPoints * product.quantity} point</p>`
            )
            .join('');

        // Sender bekræftelsesmail til brugeren
        await sendOrderConfirmation(decryptedEmail, orderDetails, user_id);

        // Sender en succesrespons med besked og ordre-ID
        res.status(200).json({
            message: 'Betaling gennemført med loyalitetspoint.',
            orderId,
        });
    } catch (error) {
        // Logger fejl og sender en fejlmeddelelse som respons
        console.error('Fejl ved betaling med loyalitetspoint:', error);
        res.status(500).json({
            message: 'Der opstod en fejl under betalingen med loyalitetspoint.',
            error,
        });
    }
};

// Eksporterer funktionerne til brug i andre dele af applikationen
module.exports = { handlePayWithCard, handlePayWithLoyaltyPoints };
