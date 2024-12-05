// Funktion til at håndtere opdatering af brugerens profil
async function saveProfile() {
    // Henter værdier fra inputfelterne i formularen
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone_number = document.getElementById("phone").value;
    const country = document.getElementById("country").value;
    const password = document.getElementById("password").value;

    // Opretter et objekt til at gemme de opdaterede data
    const updatedData = {};

    // Tilføjer kun felter til objektet, hvis de er udfyldt
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone_number) updatedData.phone_number = phone_number;
    if (country) updatedData.country = country;
    if (password) updatedData.password = password;

    // Hvis ingen felter er udfyldt, informeres brugeren, og funktionen stoppes
    if (Object.keys(updatedData).length === 0) {
        alert('Udfyld venligst mindst ét felt for at opdatere din profil.');
        return;
    }

    try {
        // Sender en PUT-anmodning til backend for at opdatere profilen
        const response = await fetch('/api/profile/edit-profile', {
            method: 'PUT', // Angiver, at dette er en opdateringsanmodning
            headers: {
                'Content-Type': 'application/json', // Angiver, at dataene sendes som JSON
            },
            body: JSON.stringify(updatedData) // Konverterer dataene til JSON-format
        });

        // Tjekker om opdateringen var succesfuld
        if (response.ok) {
            alert('Profil opdateret succesfuldt!');
            window.location.href = "/startside"; // Redirecter til startsiden
        } else {
            // Hvis opdateringen fejler, vises fejlbeskeden fra backend
            const data = await response.json();
            alert(data.message || 'Fejl ved opdatering af profil.');
        }
    } catch (error) {
        // Logger fejl, hvis noget går galt under opdateringen
        console.error('Fejl ved opdatering af profil:', error);
    }
}