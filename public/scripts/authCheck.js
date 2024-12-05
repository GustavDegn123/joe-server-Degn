// Funktion til at hente en specifik cookie ved navn
function getCookie(name) {
    // Dekoder cookien for at sikre korrekt læsning af specielle tegn
    const decodedCookie = decodeURIComponent(document.cookie);
    // Deler alle cookies op i et array baseret på semikolon
    const cookieArr = decodedCookie.split(';');
    // Itererer gennem hver cookie
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim(); // Fjerner mellemrum i starten og slutningen
        // Tjekker, om cookien starter med det ønskede navn
        if (cookie.indexOf(name + "=") === 0) {
            // Returnerer værdien af cookien
            return cookie.substring((name + "=").length, cookie.length);
        }
    }
    return null; // Returnerer null, hvis cookien ikke findes
}

// Funktion til at sikre, at brugeren er autentificeret
function ensureAuthenticated() {
    // Henter JWT (JSON Web Token) fra cookies
    const jwt = getCookie("jwt");
    // Hvis JWT ikke findes, omdirigeres brugeren til login-siden
    if (!jwt) {
        console.log("JWT ikke fundet. Omdirigerer til login-siden.");
        window.location.href = "/login"; // Juster stien til din login-side
    }
}

// Kører `ensureAuthenticated`, når dokumentet er fuldt indlæst
document.addEventListener("DOMContentLoaded", ensureAuthenticated);