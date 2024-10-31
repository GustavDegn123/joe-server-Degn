// Håndter signup og opret bruger
document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Forhindrer siden i at opdatere
  
    // Hent data fra formularen
    const name = document.getElementById("name").value;
    const email = document.getElementById("signup-email").value;
    const phone = document.getElementById("signup-phone").value;
    const password = document.getElementById("signup-password").value;
    const termsAccepted = document.getElementById("terms").checked ? 1 : 0; // Konverter til 1 eller 0
    const loyaltyProgramAccepted = document.getElementById("loyalty_program").checked ? 1 : 0; // Konverter til 1 eller 0
  
    // Pak data i et objekt
    const userData = {
        name: name,
        email: email,
        phone_number: phone,
        password: password,
        terms_accepted: termsAccepted,
        loyalty_program_accepted: loyaltyProgramAccepted
    };
  
    // Send POST-anmodning til backend for at oprette bruger
    fetch('/api/createProfile', {  // Opdateret til at matche backend-route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to create user. Status: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('User created:', data);
        alert("User account created successfully!");
  
        // Vis login-formularen efter oprettelse af bruger
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    })
    .catch(error => {
        console.error('Error creating user:', error);
        alert('There was an error creating your account. Please try again.');
    });
});
