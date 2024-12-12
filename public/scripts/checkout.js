// Funktion til at hente brugerens ID fra backend
async function fetchUserId() {
    try {
        // Sender en GET-anmodning til backend for at dekode brugerens ID
        const response = await fetch('/api/decode', {
            method: 'GET',
            credentials: 'include' // Sikrer, at session-data sendes med anmodningen
        });
        const data = await response.json();
        userId = data.userId; // Gemmer brugerens ID i en global variabel
        return userId;
    } catch (error) {
        console.error("Fejl ved hentning af bruger-ID:", error);
        return null;
    }
}

// Initialiserer bruger-ID og kurv, når siden indlæses
document.addEventListener("DOMContentLoaded", async () => {
    userId = await fetchUserId(); // Henter brugerens ID
    if (userId) {
        loadBasket(); // Indlæser kurvens data
    } else {
        console.error("Bruger-ID ikke fundet.");
    }
});

// Funktion til at indlæse kurv-data fra cookies
function loadBasket() {
    const basketData = getCookie("basket"); // Henter kurv-data fra cookies
    if (basketData) {
        const basket = JSON.parse(basketData);
        const basketItems = document.getElementById("basket-items");
        basketItems.innerHTML = ""; // Rydder tidligere elementer

        let subtotal = 0;
        let points = 0;

        // Itererer gennem kurvens produkter og tilføjer dem til listen
        for (const productName in basket) {
            const item = basket[productName];
            const li = document.createElement("li");
            li.textContent = `${item.quantity}x ${productName}; ${item.totalPrice.toFixed(2)} kr.`;
            basketItems.appendChild(li);

            subtotal += item.totalPrice; // Beregner subtotal
            points += (item.unitPoints || 0) * item.quantity; // Beregner samlede point
        }

        // Viser subtotal, point og moms
        document.getElementById("subtotal").textContent = `${subtotal.toFixed(2)} kr`;
        document.getElementById("points").textContent = `${points} point`;

        const tax = subtotal * 0.25; // Beregner moms (25%)
        document.getElementById("tax").textContent = `${tax.toFixed(2)} kr`;

        const total = subtotal; // Total uden yderligere gebyrer
        document.getElementById("total").textContent = `${total.toFixed(2)} kr`;
    }
}

// Initialiserer Stripe med public key
const stripe = Stripe('pk_test_51QHLtmDyYoD3JPze0yO9cw7XiNyWF42spzAB9othHSsS4j9uA1cDfigSer627zGupBCYPFGpioq5LlxcelYMGf9W00dCCOoQDX');

// Eventlistener for "Betal med kort"-knap
document.getElementById('payButton').addEventListener('click', async () => {
    if (!userId) {
        console.error("Bruger-ID ikke fundet.");
        return;
    }

    // Beregner totalbeløb og henter kurv-data
    const total = parseFloat(document.getElementById("total").textContent.replace(" kr", "")) * 100;
    const basketData = JSON.parse(getCookie("basket"));

    // Konverterer kurv-data til et simpelt format
    const simplifiedProducts = Object.keys(basketData).map(productName => {
        return {
            name: productName,
            quantity: basketData[productName].quantity,
            unitPoints: basketData[productName].unitPoints
        };
    });

    console.log("Data der sendes til /api/orders:", {
        user_id: userId,
        products: simplifiedProducts,
        total: total / 100
    });

    // Sender data til backend for at oprette en ordre
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            user_id: userId,
            products: simplifiedProducts,
            total: total / 100
        })
    });

    const data = await response.json();
    console.log("Svar fra /api/orders:", data);

    // Hvis en Stripe-session-ID modtages, omdirigeres brugeren til Stripe Checkout
    if (data.sessionId) {
        const result = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    } else {
        console.error('Fejl ved oprettelse af betaling:', data.error);
    }
});

// Eventlistener for "Betal med loyalitetspoint"-knap
document.addEventListener("DOMContentLoaded", () => {
    const payWithPointsButton = document.getElementById('payWithPointsButton');

    if (payWithPointsButton) {
        payWithPointsButton.addEventListener('click', async () => {
            if (!userId) {
                console.error("Bruger-ID ikke fundet.");
                return;
            }

            // Henter og parser kurv-data
            let basketData = getCookie("basket");
            if (basketData) {
                try {
                    basketData = JSON.parse(basketData);

                    // Sikrer, at kurv-data er i array-format
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
                    console.error("Fejl ved parsing af kurv-data:", e);
                    alert("Fejl: Kunne ikke læse kurv-data.");
                    return;
                }
            } else {
                console.error("Kurv-data ikke fundet.");
                alert("Ingen varer i kurven til betaling med point.");
                return;
            }

            const points = parseInt(document.getElementById("points").textContent);

            console.log("Forsøger betaling med loyalitetspoint:", {
                user_id: userId,
                products: basketData,
                points: points
            });

            // Sender data til backend for betaling med point
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
                    alert(`Betaling med loyalitetspoint gennemført. Ordre-ID: ${data.orderId}`);
                    window.location.href = "/orderconfirmed";
                } else {
                    console.error('Fejl ved betaling med point:', data.error);
                    alert('Betaling med loyalitetspoint fejlede.');
                }
            } catch (error) {
                console.error('Fejl under betaling med point:', error);
                alert('Der opstod en fejl under betalingsprocessen med point.');
            }
        });
    } else {
        console.error("Knappen til betaling med loyalitetspoint blev ikke fundet.");
    }
});

// Indlæser kurv-data, når siden indlæses
document.addEventListener("DOMContentLoaded", loadBasket);