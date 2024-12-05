// Importerer Stripe-biblioteket og initialiserer det med en hemmelig nøgle fra miljøvariabler
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Funktion til at oprette en Stripe Checkout-session
const createCheckoutSession = async (amount) => {
    // Opretter en ny Checkout-session
    const session = await stripe.checkout.sessions.create({
        // Angiver betalingsmetoder, der er tilladt (kun kortbetaling her)
        payment_method_types: ['card'],
        // Definerer de varer, der skal betales for i denne session
        line_items: [
            {
                price_data: {
                    currency: 'dkk', // Angiver valutaen (DKK)
                    product_data: { name: 'Order Payment' }, // Produktbeskrivelse
                    unit_amount: amount, // Pris i øre (cents)
                },
                quantity: 1, // Antal varer (altid 1 her)
            },
        ],
        // Sætter betalingsmetoden til "payment"
        mode: 'payment',
        // URL der sendes til, når betalingen er gennemført
        success_url: `${process.env.BASE_URL}/orderconfirmed`,
        // URL der sendes til, når betalingen annulleres
        cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    // Returnerer den oprettede session
    return session;
};

// Eksporterer funktionen, så den kan bruges i andre dele af applikationen
module.exports = createCheckoutSession;