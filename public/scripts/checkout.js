// Function to get cookie value by name
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArr = decodedCookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
            return cookie.substring((name + "=").length, cookie.length);
        }
    }
    return "";
}

// Load basket data from cookie and display on the checkout page
function loadBasket() {
    const basketData = getCookie("basket");
    if (basketData) {
        const basket = JSON.parse(basketData);

        const basketItems = document.getElementById("basket-items");
        basketItems.innerHTML = ""; // Clear any previous items to avoid duplication

        let subtotal = 0;
        let points = 0;

        for (const productName in basket) {
            const item = basket[productName];
            const li = document.createElement("li");
            li.textContent = `${item.quantity}x ${productName}; ${item.totalPrice.toFixed(2)} kr.`;
            basketItems.appendChild(li);

            subtotal += item.totalPrice;
            points += item.unitPrice * item.quantity; // Assuming `unitPrice` holds the points value for each product
        }

        // Display subtotal, points, tax, and total
        document.getElementById("subtotal").textContent = `${subtotal.toFixed(2)} kr`;
        document.getElementById("points").textContent = `${points} points`;

        const tax = subtotal * 0.2;
        document.getElementById("tax").textContent = `${tax.toFixed(2)} kr`;

        const total = subtotal + tax;
        document.getElementById("total").textContent = `${total.toFixed(2)} kr`;
    }
}

// Run loadBasket function when the page loads
document.addEventListener("DOMContentLoaded", loadBasket);
