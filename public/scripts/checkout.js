// checkout.js

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

const userId = getCookie("userId");
console.log("User ID from cookie:", userId);

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
            points += item.unitPoints * item.quantity; // Use the actual unitPoints for each item
        }

        // Display subtotal, points, tax, and total
        document.getElementById("subtotal").textContent = `${subtotal.toFixed(2)} kr`;
        document.getElementById("points").textContent = `${points} points`; // Display calculated points

        const tax = subtotal * 0.2;
        document.getElementById("tax").textContent = `${tax.toFixed(2)} kr`;

        const total = subtotal + tax;
        document.getElementById("total").textContent = `${total.toFixed(2)} kr`;
    }
}

// Initialize Stripe with your publishable key
const stripe = Stripe('pk_test_51QHLtmDyYoD3JPze0yO9cw7XiNyWF42spzAB9othHSsS4j9uA1cDfigSer627zGupBCYPFGpioq5LlxcelYMGf9W00dCCOoQDX');

document.getElementById('payButton').addEventListener('click', async () => {
    const userId = getCookie("userId");
    console.log("Retrieved User ID from cookie:", userId);

    if (!userId) {
        console.error("User ID not found.");
        return;
    }

    const total = parseFloat(document.getElementById("total").textContent.replace(" kr", "")) * 100;
    const basketData = JSON.parse(getCookie("basket"));
    
    // Prepare products array with name, quantity, and unitPoints
    const simplifiedProducts = Object.keys(basketData).map(productName => {
        return {
            name: productName,
            quantity: basketData[productName].quantity,
            unitPoints: basketData[productName].unitPoints // Include unitPoints for each product
        };
    });

    console.log("Data being sent to /api/orders:", {
        user_id: userId,
        products: simplifiedProducts,
        total: total / 100
    });

    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            products: simplifiedProducts,
            total: total / 100
        })
    });

    const data = await response.json();
    console.log("Response from /api/orders:", data);

    if (data.sessionId) {
        const result = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    } else {
        console.error('Error initiating payment:', data.error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // New function to handle loyalty points payment
    const payWithPointsButton = document.getElementById('payWithPointsButton');
    
    if (payWithPointsButton) {
        payWithPointsButton.addEventListener('click', async () => {
            const userId = getCookie("userId");
            if (!userId) {
                console.error("User ID not found.");
                return;
            }

            let basketData = getCookie("basket");
            if (basketData) {
                try {
                    basketData = JSON.parse(basketData);

                    // Convert basketData from object format to array format, ensuring productId is included
                    if (!Array.isArray(basketData)) {
                        basketData = Object.keys(basketData).map(productName => {
                            const item = basketData[productName];
                            return {
                                productId: item.productId, // Ensure this field matches your backend's expectation
                                name: productName,
                                quantity: item.quantity,
                                totalPoints: item.totalPoints,
                                totalPrice: item.totalPrice,
                                unitPoints: item.unitPoints,
                                unitPrice: item.unitPrice
                            };
                        });
                    }
                } catch (e) {
                    console.error("Error parsing basket data:", e);
                    alert("Error: Could not parse basket data.");
                    return;
                }
            } else {
                console.error("Basket data not found.");
                return;
            }

            const points = parseInt(document.getElementById("points").textContent);

            console.log("Attempting loyalty points payment with data:", {
                user_id: userId,
                products: basketData, // Now includes productId for each item
                points: points
            });

            try {
                const response = await fetch('/api/orders/loyalty', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        products: basketData,
                        points: points
                    })
                });

                const data = await response.json();

                if (data.orderId) {
                    alert(`Payment successful with loyalty points. Order ID: ${data.orderId}`);
                    window.location.href = "/success"; // Redirect to a success page
                } else {
                    console.error('Error processing loyalty points payment:', data.error);
                    alert('Payment with loyalty points failed.');
                }
            } catch (error) {
                console.error('Error during loyalty points payment:', error);
                alert('An error occurred during the loyalty points payment process.');
            }
        });
    } else {
        console.error("Pay with loyalty points button not found.");
    }
});

// Run loadBasket function when the page loads
document.addEventListener("DOMContentLoaded", loadBasket);

// Run loadBasket function when the page loads
document.addEventListener("DOMContentLoaded", loadBasket);
