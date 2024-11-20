// scripts/success.js

// Extract orderId from the query string
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch order details from the server
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
            <p>Kunne ikke hente ordredetaljer. Prøv igen senere.</p>
        `;
    }
}

// Display order details on the page
function displayOrderDetails(order) {
    const orderDetailsContainer = document.getElementById("order-details");

    const orderDate = new Date(order.order_date).toLocaleDateString("da-DK");

    const productList = order.products
        .map(
            (product) =>
                `<li>${product.name} - ${product.quantity} x ${product.price.toFixed(
                    2
                )} DKK</li>`
        )
        .join("");

    orderDetailsContainer.innerHTML = `
        <ul>
            <li><strong>Ordre ID:</strong> ${order.id}</li>
            <li><strong>Total Pris:</strong> ${order.total_price.toFixed(2)} DKK</li>
            <li><strong>Optjente Point:</strong> ${order.points_earned} point</li>
            <li><strong>Betalingsmetode:</strong> ${order.payment_method}</li>
            <li><strong>Ordredato:</strong> ${orderDate}</li>
        </ul>
        <h2>Produkter:</h2>
        <ul>${productList}</ul>
    `;
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    const orderId = getQueryParam("orderId");
    if (!orderId) {
        document.getElementById("order-details").innerHTML = `
            <p>Ordre ID mangler. Tjek venligst dit link.</p>
        `;
        return;
    }
    fetchOrderDetails(orderId);
});
