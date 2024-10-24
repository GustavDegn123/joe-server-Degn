const http = require('http');

// Asynchronous function to ping the server and measure RTT
async function pinger() {
    const clientStartTime = Date.now(); // Start time of the client request

    const options = {
        host: '46.101.233.222', // Your droplet's IP address
        port: 3000,             // The port where your server is running
        path: '/ping',          // Make sure this matches the route in your server
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';

        // Collect the response data from the server
        res.on('data', (chunk) => {
            data += chunk;
        });

        // When the full response is received
        res.on('end', () => {
            try {
                // Check if the response is JSON and parse it
                const serverResponse = JSON.parse(data);
                const clientEndTime = Date.now(); // End time of the client request
                const serverTime = serverResponse.serverTime; // Get the server's timestamp

                // Calculate Round Trip Time (RTT)
                const RTT = clientEndTime - clientStartTime;
                console.log(`RTT: ${RTT} ms`);

                // Calculate the server processing time (from server -> client)
                const serverProcessingTime = clientEndTime - serverTime;
                console.log(`Responstid (server -> klient): ${serverProcessingTime} ms`);
            } catch (error) {
                console.error("Error parsing server response:", error.message);
                console.log(data); // Log the response in case it's not JSON
            }
        });
    });

    // Handle any request errors
    req.on('error', (error) => {
        console.error(`Fejl ved ping: ${error.message}`);
    });

    // End the request
    req.end();
}

// Ping the server every 5 seconds
setInterval(pinger, 5000); // Run every 5 seconds
