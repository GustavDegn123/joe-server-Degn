// Initialiserer siden, når DOM'en er fuldt indlæst
document.addEventListener("DOMContentLoaded", () => {
    // Henter HTML-elementet, hvor ordredetaljerne skal vises
    const orderDetailsContainer = document.getElementById("order-details");

    // Tilføjer statisk indhold for at vise en bekræftelsesbesked
    orderDetailsContainer.innerHTML = `
        <img src="img/joeLogo.svg" alt="Joe Logo" class="logo" /> <!-- Logoet for Joe & the Juice -->
        <h1>Thank you for your order!</h1> <!-- Bekræftelsesoverskrift -->
        <p>Your payment was successful, and your order has been confirmed.</p> <!-- Kort besked om, at ordren er bekræftet -->
        <p>You will receive an email with the details shortly.</p> <!-- Information om, at kunden vil modtage en e-mail -->
        <a href="/startside" class="button">Back to Home</a> <!-- En knap, der fører brugeren tilbage til hjemmesiden -->
        <div class="barcode"></div> <!-- Plads til en stregkode -->
        <div class="barcode-number">123456789012</div> <!-- En statisk stregkodenummer -->
    `;
});