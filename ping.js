const http = require('http');

// Måler responstid og RTT for en HTTP GET-forespørgsel
function httpGet(url) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        let firstByteTime = null;

        const req = http.get(url, (response) => {
            response.on('data', () => {
                if (!firstByteTime) {
                    firstByteTime = Date.now();
                    console.log(`Responstid: ${firstByteTime - startTime} ms`);
                }
            });

            response.on('end', () => {
                const roundTripTime = Date.now() - startTime;
                console.log(`RTT: ${roundTripTime} ms`);
                resolve({ responseTime: firstByteTime - startTime, roundTripTime });
            });
        });

        req.setTimeout(5000, () => {
            req.abort();
            console.log('Timeout efter 5 sekunder');
            reject('Timeout');
        });

        req.on('error', (e) => reject(`Fejl: ${e.message}`));
    });
}

// Pinger en URL flere gange og udregner gennemsnitlig responstid og RTT
async function ping(url, count = 1) {
    let totalResponseTime = 0;
    let totalRTT = 0;

    for (let i = 0; i < count; i++) {
        try {
            const { responseTime, roundTripTime } = await httpGet(url);
            totalResponseTime += responseTime;
            totalRTT += roundTripTime;
            console.log(`Ping #${i + 1}: Responstid: ${responseTime} ms, RTT: ${roundTripTime} ms`);
        } catch (error) {
            console.error(error);
        }
    }

    if (count > 0) {
        console.log(`Gennemsnitlig responstid: ${(totalResponseTime / count).toFixed(2)} ms`);
        console.log(`Gennemsnitlig RTT: ${(totalRTT / count).toFixed(2)} ms`);
    }
}

// Test med 5 forespørgsler
ping('http://46.101.233.222:3000/ping', 5);
