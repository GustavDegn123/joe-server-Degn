const http = require('http');

// Måler responstid og RTT for en HTTP GET-forespørgsel
function httpGet(url) {
    return new Promise((resolve, reject) => {
        // Starter tidsmåling for hele processen
        const startTime = Date.now();
        let firstByteTime = null;

        // Starter HTTP GET-forespørgsel til den angivne URL
        const req = http.get(url, (response) => {
            // Når data modtages for første gang (første byte), måler jeg responstiden
            response.on('data', () => {
                if (!firstByteTime) {
                    firstByteTime = Date.now();
                    // Udregner og logger responstiden
                    console.log(`Responstid: ${firstByteTime - startTime} ms`);
                }
            });

            // Når hele responsen er modtaget, beregner jeg Round Trip Time (RTT)
            response.on('end', () => {
                const roundTripTime = Date.now() - startTime;
                // Logger RTT og løser Promise med responstid og RTT
                console.log(`RTT: ${roundTripTime} ms`);
                resolve({ responseTime: firstByteTime - startTime, roundTripTime });
            });
        });

        // Sætter en timeout på 5 sekunder for at undgå at vente for længe
        req.setTimeout(5000, () => {
            // Hvis der går over 5 sekunder, afbryder jeg forespørgslen
            req.abort();
            console.log('Timeout efter 5 sekunder');
            reject('Timeout');
        });

        // Håndterer eventuelle fejl under forespørgslen
        req.on('error', (e) => reject(`Fejl: ${e.message}`));
    });
}

// Pinger en URL flere gange og udregner gennemsnitlig responstid og RTT
async function ping(url, count = 1) {
    let totalResponseTime = 0;
    let totalRTT = 0;

    // Udfører flere forespørgsler, baseret på det angivne antal (count)
    for (let i = 0; i < count; i++) {
        try {
            // Kalder httpGet og tilføjer resultaterne til totalerne
            const { responseTime, roundTripTime } = await httpGet(url);
            totalResponseTime += responseTime;
            totalRTT += roundTripTime;
            // Logger resultater for hver enkelt forespørgsel
            console.log(`Ping #${i + 1}: Responstid: ${responseTime} ms, RTT: ${roundTripTime} ms`);
        } catch (error) {
            // Logger eventuelle fejl under ping-processen
            console.error(error);
        }
    }

    // Hvis der er gennemført forespørgsler, udregner jeg gennemsnitlig responstid og RTT
    if (count > 0) {
        console.log(`Gennemsnitlig responstid: ${(totalResponseTime / count).toFixed(2)} ms`);
        console.log(`Gennemsnitlig RTT: ${(totalRTT / count).toFixed(2)} ms`);
    }
}

// Tester med 5 HTTP GET-forespørgsler til den angivne URL
ping('http://46.101.233.222:3000/ping', 5);
