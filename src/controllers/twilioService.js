// Importerer Twilio-biblioteket
const twilio = require('twilio');

// Henter miljøvariabler til Twilio-konfiguration
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const twilioNumber = process.env.TWILIO_PHONE_NUMBER; // Dit Twilio telefonnummer

// Initialiserer Twilio-klienten med kontooplysninger
const client = twilio(accountSid, authToken);

// Funktion til at sende en SMS
const sendSms = async (to, message) => {
    try {
        // Sender SMS ved hjælp af Twilio-klienten
        const response = await client.messages.create({
            body: message, // SMS-indhold
            from: twilioNumber, // Twilio telefonnummer
            to: to, // Modtagerens telefonnummer
        });

        // Logger succesbesked og returnerer besked-ID
        console.log('SMS sendt succesfuldt:', response.sid);
        return response.sid;
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved afsendelse af SMS:', error.message);
        throw new Error(`Twilio Fejl: ${error.message}`);
    }
};

// Eksporterer funktionen, så den kan bruges i andre dele af applikationen
module.exports = { sendSms };