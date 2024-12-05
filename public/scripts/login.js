// Tilføjer en eventlistener til login-formularens submit-event
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Forhindrer, at siden genindlæses, når formularen indsendes
  
    // Henter data fra formularens inputfelter
    const email = document.getElementById("login-email").value; // Henter email fra inputfeltet
    const password = document.getElementById("login-password").value; // Henter password fra inputfeltet

    // Pakker de indtastede data i et objekt
    const loginData = {
        email: email,
        password: password
    };

    // Sender login-data til backend for at validere brugeroplysninger
    fetch('/api/login', {  // Matcher backend-route for login
        method: 'POST', // Angiver HTTP-metoden som POST
        headers: { 'Content-Type': 'application/json' }, // Angiver, at data sendes som JSON
        body: JSON.stringify(loginData) // Konverterer login-data til JSON-format
    })
    .then(response => {
        if (!response.ok) {
            // Kaster en fejl, hvis serveren returnerer en ikke-OK status
            throw new Error("Authentication failed. Status: " + response.status);
        }
        return response.json(); // Returnerer det parsed JSON-svar
    })
    .then(data => {
        console.log('Login successful:', data); // Logger et succesfuldt login
        alert("Login successful!"); // Viser en besked om succesfuldt login

        // Omdirigerer brugeren til startsiden efter et vellykket login
        window.location.href = "/startside"; 
    })
    .catch(error => {
        // Logger fejl, hvis login mislykkes
        console.error('Error during login:', error);
        // Viser en fejlbesked til brugeren
        alert('Login failed. Please check your email and password.');
    });
});