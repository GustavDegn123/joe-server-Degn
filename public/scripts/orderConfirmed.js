// Initialize the page with static confirmation details
document.addEventListener("DOMContentLoaded", () => {
    const orderDetailsContainer = document.getElementById("order-details");

    // Static content for visuals
    orderDetailsContainer.innerHTML = `
        <img src="img/joeLogo.svg" alt="Joe Logo" class="logo" />
        <h1>Thank you for your order!</h1>
        <p>Your payment was successful, and your order has been confirmed.</p>
        <p>You will receive an email with the details shortly.</p>
        <a href="/startside" class="button">Back to Home</a>
        <div class="barcode"></div>
        <div class="barcode-number">123456789012</div>
    `;
});
