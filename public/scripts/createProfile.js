// Tilføjer en eventlistener til tilmeldingsformularen, der håndterer formens "submit"-hændelse
document.getElementById("signup-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Forhindrer standardformularens opdatering af siden

    // Henter værdier fra inputfelterne og fjerner unødvendige mellemrum
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    // Henter værdier fra checkbokse for vilkår og loyalitetsprogram
    const termsCheckbox = document.getElementById("terms");
    const loyaltyProgramCheckbox = document.getElementById("loyalty_program");
    const termsAccepted = termsCheckbox.checked ? 1 : 0; // Konverterer til 1 eller 0
    const loyaltyProgramAccepted = loyaltyProgramCheckbox.checked ? 1 : 0;

    // Formaterer telefonnummeret med landekode, hvis det ikke allerede har en
    const countryCode = "+45"; // Landekode for Danmark
    const formattedPhone = phone.startsWith("+") ? phone : `${countryCode}${phone}`;

    // Tjekker, om browseren understøtter geolokation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Hvis geolokation er succesfuld, udføres denne funktion
            async function (position) {
                const latitude = position.coords.latitude; // Henter breddegrad
                const longitude = position.coords.longitude; // Henter længdegrad

                let userCountry = "Unknown"; // Standardværdi for landet
                try {
                    // Henter landekode baseret på geolokation
                    const response = await fetch(`/api/geolocation/getCountryCode?latitude=${latitude}&longitude=${longitude}`);
                    const data = await response.json();
                    if (data.countryCode) {
                        userCountry = data.countryCode; // Sætter landekoden, hvis den findes
                    }
                } catch (error) {
                    console.error("Fejl ved hentning af landekode:", error);
                    alert("Kunne ikke hente landekode.");
                }

                // Opretter et objekt med brugerens data
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

                // Sender brugerdata til backend for at oprette en ny bruger
                try {
                    const response = await fetch("/api/createProfile", {
                        method: "POST", // Angiver HTTP-metoden som POST
                        headers: { "Content-Type": "application/json" }, // Angiver datatypen som JSON
                        body: JSON.stringify(userData) // Konverterer objektet til JSON-format
                    });

                    if (!response.ok) {
                        throw new Error("Kunne ikke oprette bruger. Status: " + response.status);
                    }

                    const data = await response.json();
                    console.log("Bruger oprettet:", data);
                    alert("Bruger oprettet succesfuldt! Du har modtaget 1000 loyalitetspoint som en velkomstgave.");
                    window.location.href = "/login"; // Omdirigerer til login-siden
                } catch (error) {
                    console.error("Fejl ved oprettelse af bruger:", error);
                    alert("Der opstod en fejl. Prøv venligst igen.");
                }
            },
            // Hvis geolokation fejler, udføres denne funktion
            function (error) {
                console.error("Geolokationsfejl:", error);
                alert("Geolokation er påkrævet for at oprette en konto.");
            }
        );
    } else {
        // Hvis browseren ikke understøtter geolokation
        alert("Geolokation understøttes ikke af denne browser.");
    }
});
