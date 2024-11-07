document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the selected store from the cookie
    const selectedStore = getCookie("selectedStore");
    if (selectedStore) {
        const store = JSON.parse(selectedStore);

        // Display the store details in an element on the Menu page
        const storeInfoContainer = document.getElementById("store-info");
        storeInfoContainer.innerHTML = `
            <h3>Ordering from: ${store.name}</h3>
            <p>Address: ${store.address}</p>
            <p>Opening Hours: ${store.hours}</p>
        `;
    }

});

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
    console.log(`Cookie set: ${name} = ${value}`);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

const products = [
    { title: "Serrano", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Serrano?_a=BAMCkGRg0" },
    { title: "Avocado", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Avocado?_a=BAMCkGRg0" },
    { title: "Tunacado", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Tunacado?_a=BAMCkGRg0" },
    { title: "Joe's Club", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1730456097/Joe%20billeder/Joe%27s%20Club.png" },
    { title: "Power Shake", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Power%20Shake?_a=BAMCkGRg0" },
    { title: "Pick Me Up", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Pick%20Me%20Up?_a=BAMCkGRg0" },
    { title: "Avo Shake", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Avo%20Shake?_a=BAMCkGRg0" },
    { title: "Hell of a Nerve", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Hell%20of%20a%20Nerve?_a=BAMCkGRg0" },
    { title: "Americano", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Americano?_a=BAMCkGRg0" },
    { title: "Iron Man", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Iron%20Man?_a=BAMCkGRg0" },
    { title: "Go Away Doc", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Go%20Away%20Doc?_a=BAMCkGRg0" },
    { title: "Cappuccino", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Cappuccino?_a=BAMCkGRg0" },
    { title: "Espresso", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Espresso?_a=BAMCkGRg0" },
    { title: "Latte", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Latte?_a=BAMCkGRg0" }
];

// Fetch products from the backend and display them in the gallery
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            // Display product image
            const img = document.createElement("img");
            img.src = `https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/${product.name}`;
            img.alt = product.name;
            img.classList.add("product-image");

            // Display product title
            const title = document.createElement("div");
            title.classList.add("product-title");
            title.textContent = product.name;

            // Display product description
            const description = document.createElement("div");
            description.classList.add("product-description");
            description.textContent = product.description;

            // Display product price
            const price = document.createElement("div");
            price.classList.add("product-price");
            price.textContent = `${product.price.toFixed(2)} kr.`;

            // Add to Basket button
            const button = document.createElement("button");
            button.classList.add("add-to-basket");
            button.textContent = "Add to Basket";
            button.addEventListener("click", () => addToBasket(product));

            // Append elements to product card
            productCard.appendChild(img);
            productCard.appendChild(title);
            productCard.appendChild(description);
            productCard.appendChild(price);
            productCard.appendChild(button);

            document.getElementById("product-gallery").appendChild(productCard);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Initialize an empty basket object to store items
const basket = {};

// Function to add items to the basket
function addToBasket(product) {
    if (basket[product.name]) {
        // If the product is already in the basket, increment the quantity, total price, and total points
        basket[product.name].quantity += 1;
        basket[product.name].totalPrice += product.price;
        basket[product.name].totalPoints += product.points_value;
    } else {
        // If it's a new product, add it to the basket with initial quantity, price, and points
        basket[product.name] = {
            quantity: 1,
            totalPrice: product.price,
            unitPrice: product.price,
            unitPoints: product.points_value,
            totalPoints: product.points_value
        };
    }
    setCookie("basket", JSON.stringify(basket), 1); // Update the cookie with new basket data
    renderBasket();
    
    // Flyvende animation
    const productCard = document.querySelector(`img[alt="${product.name}"]`);
    const flyImg = productCard.cloneNode(true);
    flyImg.classList.add('fly');
    document.body.appendChild(flyImg);

    // Få produktbilledets position
    const startRect = productCard.getBoundingClientRect();
    const endRect = document.querySelector(".basket").getBoundingClientRect();

    // Anvend positionen for start og slut af flyvningen
    flyImg.style.left = `${startRect.left}px`;
    flyImg.style.top = `${startRect.top}px`;

    // Start animationen mod kurven
    flyImg.style.transform = `translate(${endRect.left - startRect.left}px, ${endRect.top - startRect.top}px) scale(0.5)`;

    // Fjern billedet efter animationen
    flyImg.addEventListener("animationend", () => {
        flyImg.remove();
    });
}

// Function to render the basket on the frontend
function renderBasket() {
    const basketItems = document.getElementById("basket-items");
    basketItems.innerHTML = ""; // Clear previous basket content

    for (const productName in basket) {
        const item = basket[productName];
        const li = document.createElement("li");
        li.classList.add("basket-item");

        li.innerHTML = `
            ${item.quantity}x ${productName}; ${item.totalPrice.toFixed(2)} kr. | ${item.totalPoints} points
            <button class="decrease-quantity" onclick="removeFromBasket('${productName}')">-</button>
            <button class="increase-quantity" onclick="addQuantity('${productName}')">+</button>
        `;
        
        basketItems.appendChild(li);
    }
}

// Function to increase the quantity of an item in the basket
function addQuantity(productName) {
    if (basket[productName]) {
        basket[productName].quantity += 1;
        basket[productName].totalPrice += basket[productName].unitPrice;
        basket[productName].totalPoints += basket[productName].unitPoints;
    }
    setCookie("basket", JSON.stringify(basket), 1); // Update the cookie with new basket data
    renderBasket();
}

// Function to remove items from the basket
function removeFromBasket(productName) {
    if (basket[productName]) {
        // Decrease the quantity or remove the item if quantity is 1
        if (basket[productName].quantity > 1) {
            basket[productName].quantity -= 1;
            basket[productName].totalPrice -= basket[productName].unitPrice;
            basket[productName].totalPoints -= basket[productName].unitPoints;
        } else {
            delete basket[productName]; // Remove the item entirely if quantity is 1
        }
    }
    setCookie("basket", JSON.stringify(basket), 1); // Update the cookie with new basket data
    renderBasket();
}

document.addEventListener("DOMContentLoaded", () => {
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

    fetchProducts();
});

document.getElementById("review-order").addEventListener("click", () => {
    const selectedStore = getCookie("selectedStore");
    setCookie("basket", JSON.stringify(basket), 1); // Store basket data in cookie for 1 day
    if (selectedStore) {
        setCookie("checkoutStore", selectedStore, 1); // Save store info in another cookie
        console.log("checkoutStore cookie set:", selectedStore);
    } else {
        console.error("No selectedStore data found.");
    }
    window.location.href = "/checkout"; // Navigate to checkout page
});
