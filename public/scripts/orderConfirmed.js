// orderConfirmed.js
async function fetchOrderDetails(orderId) {
    try {
        const response = await fetch(`/order-details?orderId=${orderId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch order details");
        }

        const order = await response.json();
        displayOrderDetails(order);
    } catch (error) {
        console.error("Error fetching order details:", error);
        document.getElementById("order-details").innerHTML = `
            <p>Could not fetch order details. Please try again later.</p>
        `;
    }
}

function displayOrderDetails(order) {
    const orderDetailsContainer = document.querySelector(".confirmation-container");

    const productList = order.products
        .map(
            (product) =>
                `<li>${product.name} - ${product.quantity} x ${product.unitPrice.toFixed(
                    2
                )} DKK</li>`
        )
        .join("");

    orderDetailsContainer.innerHTML = `
        <img src="img/joeLogo.svg" alt="Joe Logo" class="logo" />
        <h1>Thank you for your order!</h1>
        <ul>
            <li><strong>Order ID:</strong> ${order.order_id}</li>
            <li><strong>Total Price:</strong> ${order.total_price.toFixed(2)} DKK</li>
            <li><strong>Points Earned:</strong> ${order.points_earned}</li>
            <li><strong>Payment Method:</strong> ${order.payment_method}</li>
            <li><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleDateString("da-DK")}</li>
        </ul>
        <h2>Products:</h2>
        <ul>${productList}</ul>
        <a href="/startside" class="button">Back to Home</a>
        <div class="barcode">${order.order_id}</div> <!-- Order ID as the barcode -->
        <div class="barcode-number">${order.order_id}</div>
    `;
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    if (!orderId) {
        document.querySelector(".confirmation-container").innerHTML = `
            <p>Order ID is missing. Please check your link.</p>
        `;
        return;
    }
    fetchOrderDetails(orderId);
});
