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

// Initialize Stripe with your publishable key
const stripe = Stripe('pk_test_51QHLtmDyYoD3JPze0yO9cw7XiNyWF42spzAB9othHSsS4j9uA1cDfigSer627zGupBCYPFGpioq5LlxcelYMGf9W00dCCOoQDX'); // Replace with your actual Stripe publishable key

document.getElementById('payButton').addEventListener('click', async () => {
    // Calculate the total dynamically
    const total = parseFloat(document.getElementById("total").textContent.replace(" kr", "")) * 100; // Convert to cents
  
    // Make a request to your backend to create a checkout session with the dynamic total
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(total) }) // Send total as an integer in cents
    });
    
    const session = await response.json();
  
    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  
    if (result.error) {
      console.error(result.error.message);
    }
  });
  

// Run loadBasket function when the page loads
document.addEventListener("DOMContentLoaded", loadBasket);
