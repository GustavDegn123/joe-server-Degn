// Importerer nodemailer til e-mailafsendelse
const nodemailer = require('nodemailer');

// Importerer databaseforbindelsen
const { poolPromise, sql } = require('../../config/db');

// Konfigurerer Nodemailer transporter til at sende e-mails
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Gmail SMTP-server
  port: 587, // Port til TLS-forbindelse
  secure: false, // Sæt til true for SSL (port 465), false for TLS (port 587)
  auth: {
    user: process.env.SMTP_USER, // SMTP-brugernavn hentet fra miljøvariabel
    pass: process.env.SMTP_PASS, // SMTP-adgangskode hentet fra miljøvariabel
  },
});

// Funktion til at sende en ordrebekræftelse via e-mail
const sendOrderConfirmation = async (email, orderDetails, userId) => {
  // Definerer e-mailens indstillinger
  const mailOptions = {
    from: `"Joe & the Juice" <${process.env.SMTP_USER}>`, // Afsenderens e-mail
    to: email, // Modtagerens e-mail
    subject: 'Ordrebekræftelse fra Joe & the Juice', // E-mailens emne
    html: `
      <h1>Tak for din ordre!</h1>
      <p>Vi har modtaget din ordre og behandler den snart.</p>
      <h2>Ordredetaljer:</h2>
      ${orderDetails}
      <p>Venlig hilsen,<br>Joe & the Juice</p>
    `, // HTML-indhold af e-mailen
    text: `Tak for din ordre! Vi har modtaget din ordre og behandler den snart.\n\nOrdredetaljer:\n${orderDetails}\n\nVenlig hilsen,\nJoe & the Juice`, // Tekstversion af e-mailen
  };

  try {
    // Sender e-mailen
    await transporter.sendMail(mailOptions);
    console.log('Ordrebekræftelsesmail sendt til:', email);

    // Logger e-mailoplysninger i databasen
    const pool = await poolPromise;
    await pool.request()
      .input('user_id', sql.Int, userId) // Bruger-ID
      .input('email_type', sql.NVarChar, 'order_confirmation') // Type e-mail (ordrebekræftelse)
      .input('sent_at', sql.DateTime, new Date()) // Tidsstempel for afsendelse
      .input('content', sql.NVarChar, mailOptions.html) // HTML-indholdet af e-mailen
      .query('INSERT INTO Emails (user_id, email_type, sent_at, content) VALUES (@user_id, @email_type, @sent_at, @content)');

    console.log('Ordrebekræftelsesmail gemt i databasen!');
  } catch (error) {
    console.error('Fejl ved afsendelse af e-mail:', error);
    throw error;
  }
};

// Eksporterer funktionen, så den kan bruges i andre dele af applikationen
module.exports = sendOrderConfirmation;