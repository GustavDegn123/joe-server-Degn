// Function to retrieve a cookie by name
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

// Function to fetch the user ID from the backend
async function fetchUserId() {
    try {
        const response = await fetch('/api/decode', {
            method: 'GET',
            credentials: 'include' // Ensure session-based data is sent with the request
        });
        const data = await response.json();
        userId = data.userId; // Store user ID in the global variable
        return userId;
    } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
    }
}

// Load the user ID and basket when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    userId = await fetchUserId();
    console.log("Fetched user ID:", userId);

    if (userId) {
        loadBasket();
    } else {
        console.error("User ID not found.");
    }
});

function loadBasket() {
    const basketData = getCookie("basket");
    if (basketData) {
        const basket = JSON.parse(basketData);
        const basketItems = document.getElementById("basket-items");
        basketItems.innerHTML = ""; // Clear previous items

        let subtotal = 0;
        let points = 0;

        for (const productName in basket) {
            const item = basket[productName];
            const li = document.createElement("li");
            li.textContent = `${item.quantity}x ${productName}; ${item.totalPrice.toFixed(2)} kr.`;
            basketItems.appendChild(li);

            subtotal += item.totalPrice;
            points += (item.unitPoints || 0) * item.quantity; // Calculate total points
        }

        document.getElementById("subtotal").textContent = `${subtotal.toFixed(2)} kr`;
        document.getElementById("points").textContent = `${points} points`;

        const tax = subtotal * 0.25;
        document.getElementById("tax").textContent = `${tax.toFixed(2)} kr`;

        const total = subtotal;
        document.getElementById("total").textContent = `${total.toFixed(2)} kr`;
    }
}

// Initialize Stripe with your publishable key
const stripe = Stripe('pk_test_51QHLtmDyYoD3JPze0yO9cw7XiNyWF42spzAB9othHSsS4j9uA1cDfigSer627zGupBCYPFGpioq5LlxcelYMGf9W00dCCOoQDX');

// Event listener for "Pay with Card" button
document.getElementById('payButton').addEventListener('click', async () => {
    if (!userId) {
        console.error("User ID not found.");
        return;
    }

    const total = parseFloat(document.getElementById("total").textContent.replace(" kr", "")) * 100;
    const basketData = JSON.parse(getCookie("basket"));

    const simplifiedProducts = Object.keys(basketData).map(productName => {
        return {
            name: productName,
            quantity: basketData[productName].quantity,
            unitPoints: basketData[productName].unitPoints
        };
    });

    console.log("Data being sent to /api/orders:", {
        user_id: userId,
        products: simplifiedProducts,
        total: total / 100
    });

    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
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
    const payWithPointsButton = document.getElementById('payWithPointsButton');
    
    if (payWithPointsButton) {
        payWithPointsButton.addEventListener('click', async () => {
            if (!userId) {
                console.error("User ID not found.");
                return;
            }

            let basketData = getCookie("basket");
            if (basketData) {
                try {
                    basketData = JSON.parse(basketData);

                    // Ensure basketData is in array format for consistency
                    if (!Array.isArray(basketData)) {
                        basketData = Object.keys(basketData).map(productName => {
                            const item = basketData[productName];
                            return {
                                productId: item.productId || null,
                                name: productName,
                                quantity: item.quantity,
                                totalPoints: item.totalPoints || 0,
                                totalPrice: item.totalPrice || 0,
                                unitPoints: item.unitPoints || 0,
                                unitPrice: item.unitPrice || 0
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
                alert("No items in the basket to pay with points.");
                return;
            }

            const points = parseInt(document.getElementById("points").textContent);

            console.log("Attempting loyalty points payment with data:", {
                user_id: userId,
                products: basketData,
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
                    // Redirect with orderId
                    window.location.href = `/orderconfirmed?orderId=${data.orderId}`;
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

// Load basket data when the page loads
document.addEventListener("DOMContentLoaded", loadBasket);
