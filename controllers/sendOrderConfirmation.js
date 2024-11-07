const nodemailer = require('nodemailer');
const db = require('../config/db');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Set to true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for security
    pass: process.env.EMAIL_PASSWORD
  }
});

// Function to send order confirmation email and log in the database
const sendOrderConfirmation = async (email, orderDetails, userId) => {
  const mailOptions = {
    from: '"Joe & the Juice" <joeandthejuiceproject@gmail.com>', // Sender email
    to: email,
    subject: 'Ordrebekræftelse fra Joe & the Juice',
    html: `
      <h1>Tak for din ordre!</h1>
      <p>Vi har modtaget din ordre og behandler den snart.</p>
      <h2>Ordredetaljer:</h2>
      ${orderDetails}
      <p>Venlig hilsen,<br>Joe & the Juice</p>
    `,
    text: `Tak for din ordre! Vi har modtaget din ordre og behandler den snart.\n\nOrdredetaljer:\n${orderDetails}\n\nVenlig hilsen,\nJoe & the Juice` // Plain text fallback
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Ordrebekræftelsesmail sendt til:', email);

    // Log email details in the database
    const pool = await db.getConnection();
    await pool.request()
      .input('user_id', userId) // Make sure to pass userId as an argument
      .input('email_type', 'order_confirmation')
      .input('sent_at', new Date())
      .input('content', mailOptions.html) // Store HTML content in database
      .query('INSERT INTO Emails (user_id, email_type, sent_at, content) VALUES (@user_id, @email_type, @sent_at, @content)');

    console.log('Ordrebekræftelsesmail gemt i databasen!');
  } catch (error) {
    console.error('Fejl ved afsendelse af e-mail:', error);
    throw error;
  }
};

module.exports = sendOrderConfirmation;
