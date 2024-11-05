const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (amount, metadata) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'dkk',
                        product_data: {
                            name: 'Your Product Name',
                        },
                        unit_amount: amount, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/success`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
            metadata: metadata, // Pass metadata to session
        });
        return session;
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        throw new Error(error.message);
    }
};

module.exports = { createCheckoutSession };
