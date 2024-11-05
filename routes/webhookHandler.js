const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendOrderConfirmation = require('../controllers/sendOrderConfirmation');
const { createOrder } = require('../models/orderModel');

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        let event;

        // Check if in testing mode (skip signature verification in testing)
        if (process.env.NODE_ENV === 'test') {
            event = req.body;
            console.log("Running in test mode, skipping signature verification.");
        } else {
            // Use Stripe’s signature verification in production
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Signature verified.");
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { user_id, basket, points } = session.metadata;

            console.log('Received metadata from Stripe webhook:', session.metadata);

            // Parse the basket JSON
            let parsedBasket;
            try {
                parsedBasket = JSON.parse(basket);
                console.log("Basket parsed successfully:", parsedBasket);
            } catch (parseError) {
                console.error("Error parsing basket data:", parseError.message);
                return res.status(400).send("Invalid basket format in metadata.");
            }

            const orderData = {
                user_id,
                products: parsedBasket,
                total_price: session.amount_total / 100, // Convert cents to currency
                points_earned: parseInt(points, 10), // Ensure points is parsed as an integer
                payment_method: 'card',
                order_date: new Date()
            };

            // Attempt to create the order in the database
            try {
                const orderResult = await createOrder(orderData);
                console.log('Order successfully created in database:', orderResult);
                
                // Optionally send an order confirmation email
                if (session.customer_details && session.customer_details.email) {
                    await sendOrderConfirmation(session.customer_details.email, orderData);
                    console.log("Order confirmation email sent successfully.");
                }
                
                res.status(200).send();
            } catch (orderError) {
                console.error("Error creating order in database:", orderError.message);
                res.status(500).send("Database error: " + orderError.message);
            }
        } else {
            console.log("Unhandled event type received:", event.type);
            res.status(400).send('Unhandled event type');
        }
    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = handleStripeWebhook;
