const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (amount, orderId) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'dkk',
                    product_data: { name: 'Order Payment' },
                    unit_amount: amount, // Amount in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/orderconfirmed?orderId=${orderId}`,
        cancel_url: `${process.env.BASE_URL}/cancel`,
        metadata: { orderId }, // Include orderId in metadata
    });
    return session;
};

module.exports = createCheckoutSession;
