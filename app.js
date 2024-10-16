const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require('http'); // Til at lave HTTP-forespørgsler for at måle RTT

const app = express();

app.use(cors());

// Middleware til at logge serverens svartid
app.use((req, res, next) => {
    const startTime = Date.now(); // Starttid på serveren
    res.on("finish", () => {
        const duration = Date.now() - startTime; // Serverens behandlingstid
        console.log(`Serveren behandlede ${req.originalUrl} på ${duration} ms`); // Log serverens svartid
    });
    next();
});

// Serverer statiske filer
app.use("/static", express.static("public"));

// Hjemmeside-route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test-route
app.get("/res", (req, res) => {
  res.send("Svarbesked fra serveren");
});

// Importer routes
const userRoutes = require("./routes/userRoutes");

// Brug routes
app.use("/api/users", userRoutes);

// Start serveren og mål derefter anmodningstid, svartid og RTT
const server = app.listen(3000, () => {
  console.log("Serveren lytter på port 3000");
});

// Sætter en længere timeout på serveren (f.eks. 5 sekunder)
server.setTimeout(5000); // Sæt timeout til 5 sekunder (juster efter behov)

// Funktion til at måle anmodningstid, svartid og RTT
function measureRequestResponseRTT() {
    const reqStart = Date.now(); // Starttid for HTTP-anmodningen (klient-side)

    const options = {
        host: 'localhost',
        port: 3000,
        path: '/res',
        agent: new http.Agent({ keepAlive: true }) // Brug keep-alive agent
    };

    // Send en HTTP-anmodning fra klienten til serveren
    http.get(options, (res) => {
        let data = ''; // Buffer til at indsamle data

        // Indsaml datastykker fra svaret
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Når svaret er færdigt, beregn RTT
        res.on('end', () => {
            const reqDuration = Date.now() - reqStart; // Fuld RTT (anmodning + serverbehandling + svar)
            console.log(`HTTP RTT (Round Trip Time) for HTTP-anmodning: ${reqDuration} ms`);
        });

    }).on('error', (err) => {
        console.error(`HTTP-anmodning fejlede: ${err.message}`);
    });
}

// Mål anmodning-svar RTT hver 5. sekund
setInterval(measureRequestResponseRTT, 5000);
