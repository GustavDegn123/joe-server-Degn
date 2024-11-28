document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch product images and metadata from the backend
    const response = await fetch('/api/cloudinary/list-images'); // Adjust route as necessary
    const data = await response.json();

    // Define product information (title, description, price) to map with images
    const productDetails = [
      { name: "Serrano", description: "Skinke, mozzarella, pesto, rugbrød", price: 75.0 },
      { name: "Avocado", description: "Avocado, tomat, spinat, rugbrød", price: 75.0 },
      { name: "Tunacado", description: "Tun, avocado, tomat, rugbrød", price: 75.0 },
      { name: "Joe's Club", description: "Kylling, avocado, tomat, rugbrød", price: 75.0 },
      { name: "Power Shake", description: "Jordbær, banan, vaniljemælk", price: 75.0 },
      { name: "Pick Me Up", description: "Jordbær, banan, æble", price: 75.0 },
      { name: "Avo Shake", description: "Avocado, banan, vaniljemælk", price: 75.0 },
      { name: "Hell of a Nerve", description: "Jordbær, banan, hyldeblomst", price: 75.0 },
      { name: "Americano", description: "Sort kaffe", price: 35.0 },
      { name: "Iron Man", description: "Jordbær, kiwi, æble", price: 75.0 },
      { name: "Go Away Doc", description: "Gulerod, æble, ingefær", price: 75.0 },
      { name: "Cappuccino", description: "Espresso, mælk", price: 39.0 },
      { name: "Espresso", description: "Ren espresso", price: 20.0 },
      { name: "Latte", description: "Espresso, mælk, skum", price: 49.0 }
    ];

    // Map images from Cloudinary to products
    const products = data.images.map((url, index) => ({
      title: productDetails[index]?.name || `Product ${index + 1}`,
      description: productDetails[index]?.description || "No description available",
      price: productDetails[index]?.price || 0.0,
      imageUrl: url
    }));

    const carousel = document.querySelector(".carousel");
    const productsPerView = 5;

    // Dynamically render product cards
    products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      const img = document.createElement("img");
      img.src = product.imageUrl;
      img.alt = product.title;
      img.classList.add("product-image");

      const title = document.createElement("h3");
      title.classList.add("product-title");
      title.textContent = product.title;

      const description = document.createElement("p");
      description.classList.add("product-description");
      description.textContent = product.description;

      const price = document.createElement("p");
      price.classList.add("product-price");
      price.textContent = `${product.price.toFixed(2)} kr.`;

      productCard.appendChild(img);
      productCard.appendChild(title);
      productCard.appendChild(description);
      productCard.appendChild(price);

      carousel.appendChild(productCard);
    });

    let currentIndex = 0;

    function updateCarousel() {
      const productCards = document.querySelectorAll(".product-card");
      productCards.forEach((card, index) => {
        card.style.display =
          index >= currentIndex && index < currentIndex + productsPerView
            ? "block"
            : "none";
      });
    }

    document.querySelector(".carousel-nav.prev").addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
      } else {
        currentIndex = products.length - productsPerView;
      }
      updateCarousel();
    });

    document.querySelector(".carousel-nav.next").addEventListener("click", () => {
      if (currentIndex < products.length - productsPerView) {
        currentIndex += 1;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    });

    updateCarousel();
  } catch (error) {
    console.error("Error loading product images:", error);
  }
});
