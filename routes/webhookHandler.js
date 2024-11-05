const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendOrderConfirmation = require('../controllers/sendOrderConfirmation');

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details.email;

      // Hent ordredetaljer (opdater som nødvendigt)
      const orderDetails = `Ordre ID: ${session.id}, Total: ${session.amount_total / 100} kr.`;

      // Send ordrebekræftelse
      await sendOrderConfirmation(customerEmail, orderDetails);
    }

    res.status(200).send();
  } catch (err) {
    console.log('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = handleStripeWebhook;
