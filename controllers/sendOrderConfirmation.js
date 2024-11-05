const nodemailer = require('nodemailer');

// Konfigurer mailtransporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Funktion til at sende ordrebekræftelse
const sendOrderConfirmation = async (email, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Ordrebekræftelse fra [Din Butik]',
    html: `
      <h1>Tak for din ordre!</h1>
      <p>Vi har modtaget din ordre og behandler den snart.</p>
      <h2>Ordredetaljer:</h2>
      <p>${orderDetails}</p>
      <p>Venlig hilsen,<br>[Dit Butiksnavn]</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Ordrebekræftelsesmail sendt til:', email);
  } catch (error) {
    console.error('Fejl ved afsendelse af ordrebekræftelse:', error);
  }
};

module.exports = sendOrderConfirmation;
