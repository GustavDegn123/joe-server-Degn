const basket = {};
let userId = null;

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
    console.log(`Cookie set: ${name} = ${value}`);
}

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

async function fetchUserId() {
    try {
        const response = await fetch('/api/decode', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (data.userId) {
            setCookie("userId", data.userId, 1); // Persist user ID in cookie
            return data.userId;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
    }
}

async function fetchFavorites() {
    try {
        const userId = getCookie("userId");
        if (!userId) {
            console.error("User ID not found.");
            return [];
        }

        const response = await fetch(`/favorites/${userId}`);
        if (!response.ok) {
            console.error("Error fetching favorites:", response.statusText);
            return [];
        }

        const favorites = await response.json();
        setCookie("favorites", JSON.stringify(favorites), 1); // Save favorites to cookie
        return favorites; // Return favorites for further processing
    } catch (error) {
        console.error("Error in fetchFavorites:", error);
        return [];
    }
}

async function fetchProducts() {
    try {
        const response = await fetch("/api/products");
        const products = await response.json();

        const favorites = JSON.parse(getCookie("favorites") || "[]");

        const productGallery = document.getElementById("product-gallery");
        productGallery.innerHTML = ""; // Clear previous products

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
            favoriteButton.textContent = "☆ Add to Favorites";
            favoriteButton.setAttribute("data-id", product.id);

            // Check if this product is a favorite
            const isFavorited = favorites.some(fav => fav.id == product.id);
            if (isFavorited) {
                favoriteButton.classList.add("favorited");
                favoriteButton.textContent = "★ Favorited";
            }

            favoriteButton.addEventListener("click", () => toggleFavorite(product.id, favoriteButton));

            const button = document.createElement("button");
            button.classList.add("add-to-basket");
            button.textContent = "Add to Basket";
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
        console.error("Error fetching products:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const selectedStore = getCookie("selectedStore");
    if (selectedStore) {
        const store = JSON.parse(selectedStore);
        const storeInfoContainer = document.getElementById("store-info");
        storeInfoContainer.innerHTML = `
            <h3>Ordering from: ${store.name}</h3>
            <p>Address: ${store.address}</p>
            <p>Opening Hours: ${store.hours}</p>
        `;
    }

    userId = await fetchUserId();
    if (!userId) {
        console.error("User ID not found.");
        return;
    }

    const favorites = await fetchFavorites(); // Fetch favorites first
    await fetchProducts(); // Render products with favorite information
});

// Toggle favorite status
async function toggleFavorite(productId, button) {
    try {
        const userId = getCookie("userId");
        if (!userId) {
            alert("You must be logged in to manage favorites.");
            return;
        }

        const isFavorited = button.classList.contains("favorited");

        if (isFavorited) {
            // Remove from favorites
            const response = await fetch("/favorites/removeFavorite", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });

            if (response.ok) {
                button.classList.remove("favorited");
                button.textContent = "☆ Add to Favorites";
            } else {
                console.error("Failed to remove favorite:", await response.text());
            }
        } else {
            // Add to favorites
            const response = await fetch("/favorites/addFavorite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });

            if (response.ok) {
                button.classList.add("favorited");
                button.textContent = "★ Favorited";
            } else {
                console.error("Failed to add favorite:", await response.text());
            }
        }

        // Fetch updated favorites to synchronize the UI
        fetchFavorites();
    } catch (error) {
        console.error("Error in toggleFavorite:", error);
    }
}

// Basket functions
function addToBasket(product) {
    if (basket[product.name]) {
        basket[product.name].quantity += 1;
        basket[product.name].totalPrice += product.price;
    } else {
        basket[product.name] = {
            quantity: 1,
            totalPrice: product.price
        };
    }
    setCookie("basket", JSON.stringify(basket), 1);
    renderBasket();
}

function renderBasket() {
    const basketItems = document.getElementById("basket-items");
    basketItems.innerHTML = "";

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

function addQuantity(productName) {
    if (basket[productName]) {
        basket[productName].quantity += 1;
        basket[productName].totalPrice += basket[productName].unitPrice;
    }
    setCookie("basket", JSON.stringify(basket), 1);
    renderBasket();
}

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

document.getElementById("review-order").addEventListener("click", () => {
    const selectedStore = getCookie("selectedStore");
    setCookie("basket", JSON.stringify(basket), 1);
    if (selectedStore) {
        setCookie("checkoutStore", selectedStore, 1);
    } else {
        console.error("No selectedStore data found.");
    }
    window.location.href = "/checkout";
});
