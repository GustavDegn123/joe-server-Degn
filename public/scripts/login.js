document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Forhindrer siden i at opdatere
  
    // Hent data fra formularen
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Pak data i et objekt
    const loginData = {
        email: email,
        password: password
    };

    // Send login data til backend
    fetch('/api/login', {  // Matcher backend-route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Authentication failed. Status: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Login successful:', data);
        alert("Login successful!");

        // Her kan du sende brugeren videre til en ny side efter login
        window.location.href = "/ordernow"; // Redirect til dashboard eller en anden side
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('Login failed. Please check your email and password.');
    });
});
