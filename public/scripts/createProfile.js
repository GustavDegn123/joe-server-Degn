// Håndter signup og opret bruger
document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Forhindrer siden i at opdatere

    // Hent data fra formularen
    const name = document.getElementById("name").value;
    const email = document.getElementById("signup-email").value;
    const phone = document.getElementById("signup-phone").value;
    const password = document.getElementById("signup-password").value;
    const termsCheckbox = document.getElementById("terms");
    const loyaltyProgramCheckbox = document.getElementById("loyalty_program");
    const termsAccepted = termsCheckbox ? (termsCheckbox.checked ? 1 : 0) : 0;
    const loyaltyProgramAccepted = loyaltyProgramCheckbox ? (loyaltyProgramCheckbox.checked ? 1 : 0) : 0;

    // Hent geolocation (latitude og longitude)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Hent landekode fra OpenCage API
                let userCountry = 'Unknown';
                try {
                    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=95a3993deb6742b298204367f83b405b`);
                    const data = await response.json();
                    if (data.results.length > 0) {
                        userCountry = data.results[0].components.country_code.toUpperCase();
                    }
                } catch (error) {
                    console.error('Error fetching country code:', error);
                    alert("Unable to retrieve country code from location. Please try again.");
                }

                // Pak data i et objekt, inklusive geolocation og landekode
                const userData = {
                    name: name,
                    email: email,
                    phone_number: phone,
                    password: password,
                    terms_accepted: termsAccepted,
                    loyalty_program_accepted: loyaltyProgramAccepted,
                    country: userCountry,
                    latitude: latitude,
                    longitude: longitude
                };

                // Send data til backend
                fetch('/api/createProfile', {
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
                    // Naviger til login-siden efter oprettelse af bruger
                    window.location.href = "/login";
                })
                .catch(error => {
                    console.error('Error creating user:', error);
                    alert('There was an error creating your account. Please try again.');
                });
            },
            function(error) {
                console.error("Error retrieving location:", error);
                alert("Geolocation is required to create an account.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
