require('dotenv').config();  // Load environment variables from the .env file
// Import Stripe and initialize it with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Function to create a checkout session
const createCheckoutSession = async (amount) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'dkk', // or 'kr' if Stripe supports it for your region
            product_data: {
              name: 'Your Product Name',
            },
            unit_amount: amount, // Amount in cents (e.g., 100 kr = 10000)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Export the function
module.exports = { createCheckoutSession };
