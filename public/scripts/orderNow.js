// Initialiserer en tom kurv og en variabel til bruger-ID
const basket = {};
let userId = null;

// Funktion til at sætte en cookie med navn, værdi og udløbsdato
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
    console.log(`Cookie sat: ${name} = ${value}`);
}

// Funktion til at hente en cookie ved navn
function getCookie(name) {
    const cookieArray = document.cookie.split("; ");
    for (const cookie of cookieArray) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

// Funktion til at indlæse kurv fra cookie
function loadBasketFromCookie() {
    const basketCookie = getCookie("basket");
    if (basketCookie) {
        try {
            const savedBasket = JSON.parse(basketCookie);
            Object.assign(basket, savedBasket); // Indlæser gemt kurv i hukommelsen
            console.log("Kurv indlæst fra cookie:", basket);
        } catch (error) {
            console.error("Ugyldige data i kurv-cookie:", error);
        }
    }
}

// Funktion til at vise kurvens indhold på siden
function renderBasket() {
    const basketItems = document.getElementById("basket-items");
    basketItems.innerHTML = ""; // Rydder tidligere indhold

    for (const productName in basket) {
        const item = basket[productName];
        const li = document.createElement("li");
        li.classList.add("basket-item");
        li.innerHTML = `
            ${item.quantity}x ${productName}; ${item.totalPrice.toFixed(2)} kr.
            <button class="decrease-quantity" onclick="removeFromBasket('${productName}')">-</button>
            <button class="increase-quantity" onclick="addQuantity('${productName}')">+</button>
        `;
        basketItems.appendChild(li);
    }
}

// Funktion til at tilføje et produkt til kurven
function addToBasket(product) {
    if (basket[product.name]) {
        basket[product.name].quantity += 1;
        basket[product.name].totalPrice += basket[product.name].unitPrice;
    } else {
        basket[product.name] = {
            quantity: 1,
            totalPrice: product.price,
            unitPrice: product.price, // Enhedspris
            unitPoints: product.points_value || 0, // Loyalitetspoint (standard 0)
        };
    }
    setCookie("basket", JSON.stringify(basket), 1); // Gemmer opdateret kurv i cookie
    renderBasket();
}

// Funktion til at øge mængden af et produkt i kurven
function addQuantity(productName) {
    if (basket[productName]) {
        basket[productName].quantity += 1;
        basket[productName].totalPrice += basket[productName].unitPrice;
    }
    setCookie("basket", JSON.stringify(basket), 1);
    renderBasket();
}

// Funktion til at fjerne et produkt fra kurven
function removeFromBasket(productName) {
    if (basket[productName]) {
        if (basket[productName].quantity > 1) {
            basket[productName].quantity -= 1;
            basket[productName].totalPrice -= basket[productName].unitPrice;
        } else {
            delete basket[productName];
        }
    }
    setCookie("basket", JSON.stringify(basket), 1);
    renderBasket();
}

// Venter på, at DOM'en indlæses
document.addEventListener("DOMContentLoaded", async () => {
    // Indlæser kurv fra cookie
    loadBasketFromCookie();
    renderBasket();

    // Indlæser butiksinfo, hvis det er gemt
    const selectedStore = getCookie("selectedStore");
    if (selectedStore) {
        const store = JSON.parse(selectedStore);
        const storeInfoContainer = document.getElementById("store-info");
        storeInfoContainer.innerHTML = `
            <h3>Bestiller fra: ${store.name}</h3>
            <p>Adresse: ${store.address}</p>
            <p>Åbningstider: ${store.hours}</p>
        `;
    }

    // Henter dekodet bruger-ID
    userId = await fetchUserId();
    if (!userId) {
        console.error("Bruger-ID ikke fundet.");
        return;
    }

    // Henter og viser produkter
    await fetchProducts();
});

// Funktion til at hente dekodet bruger-ID fra backend
async function fetchUserId() {
    try {
        const response = await fetch('/api/decode', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (data.userId) {
            return data.userId;
        }
        return null;
    } catch (error) {
        console.error("Fejl ved hentning af bruger-ID:", error);
        return null;
    }
}

// Funktion til at hente brugerens favoritter fra backend
async function fetchFavorites() {
    try {
        const response = await fetch(`/favorites/${userId}`);
        if (!response.ok) throw new Error("Kunne ikke hente favoritter");
        const favorites = await response.json();
        setCookie("favorites", JSON.stringify(favorites), 1); // Gemmer favoritter i cookie
        return favorites;
    } catch (error) {
        console.error("Fejl i fetchFavorites:", error);
        return [];
    }
}

// Funktion til at tilføje eller fjerne favoritter
async function toggleFavorite(productId, button) {
    try {
        const isFavorited = button.classList.contains("favorited");

        if (isFavorited) {
            const response = await fetch("/favorites/removeFavorite", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });
            if (response.ok) {
                button.classList.remove("favorited");
                button.textContent = "☆ Tilføj til favoritter";
            }
        } else {
            const response = await fetch("/favorites/addFavorite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });
            if (response.ok) {
                button.classList.add("favorited");
                button.textContent = "★ Favorit";
            }
        }
    } catch (error) {
        console.error("Fejl i toggleFavorite:", error);
    }
}

// Funktion til at hente produkter fra backend og vise dem i UI
async function fetchProducts() {
    try {
        const response = await fetch("/api/products");
        const products = await response.json();

        const favorites = await fetchFavorites();
        const productGallery = document.getElementById("product-gallery");
        productGallery.innerHTML = ""; // Rydder tidligere produkter

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            const img = document.createElement("img");
            img.src = `https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/${product.name}`;
            img.alt = product.name;
            img.classList.add("product-image");

            const title = document.createElement("div");
            title.classList.add("product-title");
            title.textContent = product.name;

            const description = document.createElement("div");
            description.classList.add("product-description");
            description.textContent = product.description;

            const price = document.createElement("div");
            price.classList.add("product-price");
            price.textContent = `${product.price.toFixed(2)} kr.`;

            const favoriteButton = document.createElement("button");
            favoriteButton.classList.add("favorite-button");
            favoriteButton.textContent = "☆ Tilføj til favoritter";

            if (favorites.some(fav => fav.id == product.id)) {
                favoriteButton.classList.add("favorited");
                favoriteButton.textContent = "★ Favorit";
            }

            favoriteButton.addEventListener("click", () => toggleFavorite(product.id, favoriteButton));

            const button = document.createElement("button");
            button.classList.add("add-to-basket");
            button.textContent = "Tilføj til kurv";
            button.addEventListener("click", () => addToBasket(product));

            productCard.appendChild(img);
            productCard.appendChild(title);
            productCard.appendChild(description);
            productCard.appendChild(price);
            productCard.appendChild(favoriteButton);
            productCard.appendChild(button);

            productGallery.appendChild(productCard);
        });
    } catch (error) {
        console.error("Fejl i fetchProducts:", error);
    }
}

// Eventlistener til "Gennemse ordre"-knappen
document.getElementById("review-order").addEventListener("click", () => {
    const selectedStore = getCookie("selectedStore");
    setCookie("basket", JSON.stringify(basket), 1);
    if (selectedStore) {
        setCookie("checkoutStore", selectedStore, 1);
    }
    window.location.href = "/checkout"; // Redirecter til checkout-side
});