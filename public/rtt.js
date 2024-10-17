async function measureRTT() {
    const clientStartTime = Date.now();  // Capture the time the request is sent
  
    const response = await fetch('/ping');  // Make a request to the server's /ping endpoint
    const data = await response.json();
  
    const clientEndTime = Date.now();  // Capture the time the response is received
    const rtt = clientEndTime - clientStartTime;  // Calculate Round Trip Time
  
    console.log(`RTT: ${rtt} ms`);
    console.log(`Server Time: ${data.serverTime}`);
  }
  
  // Call the function when the page loads
  document.addEventListener("DOMContentLoaded", () => {
    measureRTT();
  });