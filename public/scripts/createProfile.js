document.getElementById("signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const termsCheckbox = document.getElementById("terms");
    const loyaltyProgramCheckbox = document.getElementById("loyalty_program");
    const termsAccepted = termsCheckbox.checked ? 1 : 0;
    const loyaltyProgramAccepted = loyaltyProgramCheckbox.checked ? 1 : 0;

    // Format phone number
    const countryCode = "+45"; // Denmark country code
    const formattedPhone = phone.startsWith("+") ? phone : `${countryCode}${phone}`;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                let userCountry = "Unknown";
                try {
                    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=95a3993deb6742b298204367f83b405b`);
                    const data = await response.json();
                    if (data.results.length > 0) {
                        userCountry = data.results[0].components.country_code.toUpperCase();
                    }
                } catch (error) {
                    console.error("Error fetching country code:", error);
                    alert("Unable to retrieve country code.");
                }

                const userData = {
                    name,
                    email,
                    phone: formattedPhone,
                    password,
                    terms_accepted: termsAccepted,
                    loyalty_program_accepted: loyaltyProgramAccepted,
                    country: userCountry,
                    latitude,
                    longitude
                };

                // Send data to backend
                try {
                    const response = await fetch("/api/createProfile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData)
                    });

                    if (!response.ok) {
                        throw new Error("Failed to create user. Status: " + response.status);
                    }

                    const data = await response.json();
                    console.log("User created:", data);
                    alert("User account created successfully! You have received 1000 loyalty points as a welcome gift.");
                    window.location.href = "/login";
                } catch (error) {
                    console.error("Error creating user:", error);
                    alert("An error occurred. Please try again.");
                }
            },
            function (error) {
                console.error("Geolocation error:", error);
                alert("Geolocation is required to create an account.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
