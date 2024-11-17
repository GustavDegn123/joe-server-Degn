const twilio = require('twilio');

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const twilioNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number
const client = twilio(accountSid, authToken);

const sendSms = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: twilioNumber, // Your Twilio number
            to: to, // Recipient phone number
        });
        console.log('SMS sent successfully:', response.sid);
        return response.sid;
    } catch (error) {
        console.error('Failed to send SMS:', error.message);
        throw new Error(`Twilio Error: ${error.message}`);
    }
};

module.exports = { sendSms };
