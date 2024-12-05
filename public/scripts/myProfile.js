// Når DOM'en er fuldt indlæst, tilføjes event listeners og initialiseres profilindlæsning
document.addEventListener("DOMContentLoaded", () => {
    // Henter knappen til at redigere profil
    const editProfileButton = document.getElementById("edit-profile-button");
    
    // Hvis knappen findes, tilføjes en klik-eventlistener
    if (editProfileButton) {
        editProfileButton.addEventListener("click", () => {
            // Redirecter brugeren til redigeringsprofil-siden
            window.location.href = "/edit-profile";
        });
    }
});

// Asynkron funktion til at hente brugerens profiloplysninger
async function loadUserProfile() {
    try {
        // Sender en GET-anmodning til backend for at hente profiloplysninger
        const response = await fetch('/api/profile/my-profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Angiver typen af data, der sendes
            },
            credentials: 'include' // Sørger for, at cookies inkluderes i anmodningen
        });

        // Tjekker, om anmodningen lykkedes
        if (!response.ok) {
            throw new Error('Kunne ikke hente profiloplysninger');
        }

        // Læser og parser JSON-svaret
        const data = await response.json();

        // Udfylder loyalitetskortet med de hentede data
        document.getElementById("full-name").textContent = data.name; // Udfylder fulde navn
        document.getElementById("email").textContent = data.email; // Udfylder e-mail
        document.getElementById("phone-number").textContent = data.phone_number; // Udfylder telefonnummer
        document.getElementById("country").textContent = data.country; // Udfylder land
        document.getElementById("loyalty-points").textContent = data.loyalty_points; // Udfylder loyalitetspoint
        document.getElementById("total-orders").textContent = data.total_orders; // Udfylder totale ordrer
    } catch (error) {
        // Logger fejl, hvis der opstår problemer med at hente profiloplysninger
        console.error('Fejl ved indlæsning af profil:', error);
    }
}

// Når siden indlæses, kaldes funktionen til at indlæse profiloplysninger
document.addEventListener("DOMContentLoaded", loadUserProfile);