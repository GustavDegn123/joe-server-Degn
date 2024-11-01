const nodemailer = require('nodemailer');
const db = require('../config/db');

// SMTP-konfiguration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'joeandthejuiceproject@gmail.com',
        pass: 'pztw pedx qjni btry'
    }
});

exports.sendWelcomeEmail = async (user) => {
    const mailOptions = {
        from: '"Joe & the Juice" <joeandthejuiceproject@gmail.com>',  // Afsenderens e-mail
        to: user.email,                                      // Modtagerens e-mail
        subject: 'Velkommen til Joe & the Juice!',
        text: `Tak for oprettelsen af din profil hos Joe & the Juice.
        
Navn: ${user.name}
E-mail: ${user.email}
Telefonnummer: ${user.phone_number}

Bemærk venligst, at du også har accepteret vores vilkår og betingelser samt vores loyalitetsprogram. Velkommen til The Joe World!`
    };

    console.log("Sending email with options:", mailOptions); // Debug e-mailindstillinger

    try {
        // Send e-mail
        await transporter.sendMail(mailOptions);

        // Gem e-mailoplysninger i databasen
        const pool = await db.getConnection();
        await pool.request()
            .input('user_id', user.id)
            .input('email_type', 'welcome')
            .input('sent_at', new Date())
            .input('content', mailOptions.text)
            .query('INSERT INTO Emails (user_id, email_type, sent_at, content) VALUES (@user_id, @email_type, @sent_at, @content)');

        console.log('Velkomst-e-mail sendt og gemt i databasen!');
    } catch (error) {
        console.error('Fejl ved afsendelse af e-mail:', error);
        throw error;
    }
};
