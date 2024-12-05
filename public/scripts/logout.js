// Asynkron funktion til at logge brugeren ud
async function logout() {
    try {
        // Fjerner alle cookies ved at sætte deres udløbsdato til en tidligere dato
        const cookies = document.cookie.split("; "); // Henter alle cookies
        for (let cookie of cookies) {
            const eqPos = cookie.indexOf("="); // Finder separatoren mellem navn og værdi
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie; // Henter cookie-navnet
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`; // Sletter cookien
        }

        // Sender en logout-anmodning til serveren
        const response = await fetch('/api/logout', {
            method: 'POST', // Angiver HTTP-metoden som POST
            credentials: 'include', // Sørger for, at cookies inkluderes i anmodningen
        });

        // Hvis logout lykkes, omdirigeres brugeren til login-siden
        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Logout mislykkedes'); // Logger fejl, hvis logout fejler
        }
    } catch (error) {
        // Logger fejl, hvis der opstår problemer under logout-processen
        console.error('Fejl under logout:', error);
    }
}

// Når DOM'en er indlæst, tilføjes en eventlistener til logout-knappen
document.addEventListener('DOMContentLoaded', () => {
    // Henter logout-knappen fra DOM'en
    const logoutButton = document.querySelector('.user-button');
    
    // Hvis knappen findes, tilføjes en klik-eventlistener
    if (logoutButton) {
        logoutButton.addEventListener('click', logout); // Knytter logout-funktionen til knappen
    }
});