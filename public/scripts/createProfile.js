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

                // Log raw data before encryption
                console.log("Raw data before encryption:", {
                    name,
                    email,
                    phone: formattedPhone,
                    country: userCountry,
                    latitude,
                    longitude,
                });

 // Store plaintext phone separately for use in email/SMS
const plaintextPhone = formattedPhone;

// Encrypt each field individually
let encryptedName, encryptedEmail, encryptedPhone, encryptedCountry, encryptedLatitude, encryptedLongitude;
try {
    const encryptionRequests = [
        { data: name },
        { data: email },
        { data: formattedPhone }, // Encrypt phone
        { data: userCountry },
        { data: latitude },
        { data: longitude },
    ];

    const encryptionResponses = await Promise.all(
        encryptionRequests.map((req) =>
            fetch("/crypto/asymmetric/encrypt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req),
            }).then((res) => res.json())
        )
    );

    [encryptedName, encryptedEmail, encryptedPhone, encryptedCountry, encryptedLatitude, encryptedLongitude] =
        encryptionResponses.map((res) => res.encryptedData);

    // Log encrypted data
    console.log("Encrypted data to be sent:", {
        encryptedName,
        encryptedEmail,
        encryptedPhone,
        encryptedCountry,
        encryptedLatitude,
        encryptedLongitude,
    });
} catch (error) {
    console.error("Error encrypting data:", error.message);
    alert("Failed to encrypt data.");
    return;
}

// Prepare data to send to the backend
const userData = {
    encryptedName,
    encryptedEmail,
    encryptedPhone,
    encryptedCountry,
    encryptedLatitude,
    encryptedLongitude,
    plaintextPhone, // Include plaintext phone for email/SMS notifications
    password, // Plain password for hashing
    terms_accepted: termsAccepted,
    loyalty_program_accepted: loyaltyProgramAccepted,
};

try {
    const response = await fetch("/api/createProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
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
