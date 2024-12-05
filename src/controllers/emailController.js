// Importerer nodemailer til at sende e-mails
const nodemailer = require('nodemailer');

// Importerer databaseforbindelsen
const db = require('../../config/db');

// Konfigurerer SMTP-transporter til e-mailafsendelse
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP-server
    port: 587, // Standard SMTP-port
    secure: false, // Bruger TLS, ikke SSL
    auth: {
        user: process.env.SMTP_USER, // SMTP-brugernavn fra miljøvariabel
        pass: process.env.SMTP_PASS  // SMTP-adgangskode fra miljøvariabel
    }
});

// Funktion til at sende velkomst-e-mail til brugeren
exports.sendWelcomeEmail = async (user) => {
    // Definerer indstillinger for e-mailen
    const mailOptions = {
        from: `"Joe & the Juice" <${process.env.SMTP_USER}>`, // Afsenderens e-mail
        to: user.email,                                      // Modtagerens e-mail
        subject: 'Velkommen til Joe & the Juice!',           // E-mailens emne
        text: `Tak for oprettelsen af din profil hos Joe & the Juice.
        
Navn: ${user.name}
E-mail: ${user.email}

Bemærk venligst, at du også har accepteret vores vilkår og betingelser samt vores loyalitetsprogram. Velkommen til The Joe World!` // E-mailens tekstindhold
    };

    try {
        // Sender e-mailen ved hjælp af transporter
        await transporter.sendMail(mailOptions);

        // Opretter forbindelse til databasen for at gemme e-mailoplysninger
        const pool = await db.getConnection();

        // Indsætter e-mailoplysninger i tabellen "Emails"
        await pool.request()
            .input('user_id', user.id)            // Bruger-ID
            .input('email_type', 'welcome')      // E-mailtype (velkomst)
            .input('sent_at', new Date())        // Afsendelsestidspunkt
            .input('content', mailOptions.text)  // E-mailens indhold
            .query(`
                INSERT INTO Emails (user_id, email_type, sent_at, content)
                VALUES (@user_id, @email_type, @sent_at, @content)
            `);

        // Logger succesmeddelelse
        console.log('Velkomst-e-mail sendt og gemt i databasen!');
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved afsendelse af e-mail:', error);
        throw error;
    }
};