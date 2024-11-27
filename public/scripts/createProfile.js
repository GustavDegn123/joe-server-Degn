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

    let latitude = null;
    let longitude = null;
    let userCountry = "Unknown";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                // Fetch country using geolocation
                try {
                    const response = await fetch(
                        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=95a3993deb6742b298204367f83b405b`
                    );
                    const data = await response.json();
                    if (data.results.length > 0) {
                        userCountry = data.results[0].components.country_code.toUpperCase();
                    }
                } catch (error) {
                    console.error("Error fetching country code:", error);
                    alert("Unable to retrieve country code.");
                }

                // Encrypt sensitive data before sending it to the backend
                let encryptedData;
                try {
                    const response = await fetch("/crypto/asymmetric/encrypt", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            data: {
                                name,
                                email,
                                phone: formattedPhone,
                                country: userCountry,
                                latitude,
                                longitude
                            }
                        })
                    });
                
                    if (!response.ok) {
                        const errorDetails = await response.json();
                        throw new Error(`Encryption failed: ${errorDetails.error}`);
                    }
                
                    encryptedData = await response.json();
                } catch (error) {
                    console.error("Error encrypting data:", error.message);
                    alert("Failed to encrypt data. Please check your input and try again.");
                    return;
                }                

                console.log("Raw data being sent for encryption:", {
                    name,
                    email,
                    phone: formattedPhone,
                    country: userCountry,
                    latitude,
                    longitude,
                });
                
                console.log("Encrypted data received:", encryptedData);                

                // Prepare final data to send to the backend
                const userData = {
                    ...encryptedData, // Encrypted name, email, phone, country, latitude, longitude
                    password, // Send password for hashing
                    terms_accepted: termsAccepted,
                    loyalty_program_accepted: loyaltyProgramAccepted
                };

                // Send encrypted data to the backend
                try {
                    const response = await fetch("/api/createProfile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData)
                    });

                    if (!response.ok) {
                        throw new Error("Failed to create user.");
                    }

                    const data = await response.json();
                    alert("User account created successfully!");
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
