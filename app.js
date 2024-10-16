const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require('http'); // Til at lave HTTP-forespørgsler for at måle RTT

const app = express();

// Brug CORS-middleware for at tillade cross-origin requests
app.use(cors());

// Middleware til at parse JSON i POST-anmodninger
app.use(express.json()); // Sørger for, at vi kan modtage JSON-formateret data i API-forespørgsler

// Servér statiske filer fra "public" mappen (til billeder, CSS, JS osv.)
app.use(express.static('/var/www/joe-server-Degn/public'));

// Route til forsiden af hjemmesiden (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join('/var/www/joe-server-Degn/public', "index.html"));
});
  
// Test-route til at returnere en simpel besked (brugt til RTT-målinger)
app.get("/res", (req, res) => {
  res.send("Svarbesked fra serveren"); // Returnerer en simpel tekstbesked
});

// Importer ruter for brugere fra eksterne filer (separat fil til brugerruter)
const userRoutes = require("./routes/userRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Brug ruterne for brugere
app.use("/api/users", userRoutes); // Matcher alle ruter under /api/users

// Brug ruterne for onboarding
app.use("/api/onboarding", onboardingRoutes); // Matcher ruter under /api/onboarding

// Brug ruterne for feedback
app.use("/api/feedback", feedbackRoutes); // Matcher ruter under /api/feedback

// Start serveren og lyt på port 3000
const server = app.listen(3000, () => {
  console.log("Serveren lytter på port 3000");
});

// Sæt en timeout på serveren (f.eks. 5 sekunder)
server.setTimeout(5000); // Hvis en anmodning tager længere end 5 sekunder, afbrydes den

// Funktion til at måle anmodningstid, svartid og Round Trip Time (RTT) (deaktiveret med kommentarer)
/*
function measureRequestResponseRTT() {
    const reqStart = Date.now(); // Starttidspunkt for HTTP-anmodningen fra klient-siden

    const options = {
        host: 'localhost', // Adresse til den lokale server
        port: 3000,        // Port til serveren
        path: '/res',      // Bruger test-routen "/res" til at måle RTT
        agent: new http.Agent({ keepAlive: true }) // Brug "keep-alive" for at genbruge TCP-forbindelser
    };

    // Send en HTTP GET-anmodning til serveren for at måle RTT
    http.get(options, (res) => {
        let data = ''; // Buffer til at indsamle data fra svaret

        // Når data modtages, tilføj det til buffer
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Når svaret er færdigt (alle data modtaget), beregn RTT
        res.on('end', () => {
            const reqDuration = Date.now() - reqStart; // Beregn fuld RTT (anmodningstid + svartid)
            console.log(`HTTP RTT (Round Trip Time) for HTTP-anmodning: ${reqDuration} ms`); // Udskriv RTT
        });

    }).on('error', (err) => {
        console.error(`HTTP-anmodning fejlede: ${err.message}`); // Håndter eventuelle fejl i HTTP-anmodningen
    });
}

// Kør måling af anmodning-svar RTT hver 5. sekund (5000 ms) (deaktiveret med kommentarer)
*/
