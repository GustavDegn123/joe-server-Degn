# Netværksapplikation - Betalingssystem og Loyalitetsprogram

## Formål
Dette projekt demonstrerer en netværksapplikation udviklet som en del af en eksamensopgave.

## Opsætning på Localhost

### Krav
1. Installer **Node.js** (mindst version 14.0.0).
2. Opret en `.env`-fil i projektets rodmappe med følgende variabler:
    ```
    DB_USER=<din-database-bruger>
    DB_PASSWORD=<dit-database-password>
    DB_SERVER=<din-database-server>
    DB_NAME=<din-database-navn>
    DB_ENCRYPT=true
    JWT_SECRET=<din-jwt-secret>
    BASE_URL=http://localhost:3000
    STRIPE_SECRET_KEY=<din-stripe-secret-key>
    STRIPE_WEBHOOK_SECRET=<din-stripe-webhook-secret>
    TWILIO_ACCOUNT_SID=<din-twilio-account-sid>
    TWILIO_AUTH_TOKEN=<dit-twilio-auth-token>
    TWILIO_PHONE_NUMBER=<dit-twilio-telefonnummer>
    SMTP_USER=<din-smtp-bruger>
    SMTP_PASS=<dit-smtp-password>
    MAPBOX_ACCESS_TOKEN=<dit-mapbox-access-token>
    CLOUDINARY_CLOUD_NAME=<dit-cloudinary-cloudnavn>
    CLOUDINARY_API_KEY=<din-cloudinary-api-key>
    CLOUDINARY_API_SECRET=<din-cloudinary-api-secret>
    PRIVATE_KEY=<din-rsa-private-key>
    PUBLIC_KEY=<din-rsa-public-key>
    OPENCAGE_API_KEY=<din-opencage-api-key>
    ```

### Installation
1. Klon projektet til din lokale maskine:
    ```bash
    git clone https://github.com/GustavDegn123/joe-server-Degn.git
    cd joe-server-Degn
    ```
2. Installer afhængigheder:
    ```bash
    npm install
    ```
3. Start applikationen:
    ```bash
    npm start
    ```
4. Applikationen kører nu på `http://localhost:3000`.

## Cloud Infrastruktur og Eksterne API-nøgler
Dette projekt benytter følgende cloud-infrastruktur og eksterne API'er:
- **Stripe** til betalingshåndtering
- **Twilio** til SMS
- **OpenCage API** til geografisk lokation
- **Cloudinary** til billedhåndtering
- **SMTP-server** til e-mails
- **Mapbox til kort- og lokationsbaserede funktioner

Alle ovenstående services kræver API-nøgler eller adgangsoplysninger, som skal indsættes i `.env`-filen.

## Database Dump
For at opsætte databasen lokalt, brug `schema_dump.sql` til at oprette nødvendige tabeller. Følg nedenstående trin:

1. Sørg for at have adgang til en SQL Server (lokalt eller cloud-baseret).
2. Kør følgende kommando for at importere skemaet:
    ```bash
    sqlcmd -S <din-server> -U <din-bruger> -P <dit-password> -d <database-navn> -i schema_dump.sql
    ```