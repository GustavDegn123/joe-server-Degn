// Venter på, at DOM'en er indlæst, før koden kører
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Henter produktbilleder og metadata fra backend
    const response = await fetch('/api/cloudinary/list-images'); // Juster ruten efter behov
    const data = await response.json();

    // Definerer produktinformation (titel, beskrivelse, pris) til mapping med billeder
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

    // Mapper billeder fra Cloudinary til produkter
    const products = data.images.map((url, index) => ({
      title: productDetails[index]?.name || `Product ${index + 1}`,
      description: productDetails[index]?.description || "Ingen beskrivelse tilgængelig",
      price: productDetails[index]?.price || 0.0,
      imageUrl: url
    }));

    // Henter carousel-elementet og angiver, hvor mange produkter der vises ad gangen
    const carousel = document.querySelector(".carousel");
    const productsPerView = 5;

    // Dynamisk genererer produktkort og tilføjer dem til carousel
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

    // Angiver den nuværende startindeks i carousel
    let currentIndex = 0;

    // Opdaterer carousel-visningen baseret på den aktuelle indeks
    function updateCarousel() {
      const productCards = document.querySelectorAll(".product-card");
      productCards.forEach((card, index) => {
        card.style.display =
          index >= currentIndex && index < currentIndex + productsPerView
            ? "block"
            : "none";
      });
    }

    // Tilføjer funktionalitet til knappen for at gå til forrige produkter
    document.querySelector(".carousel-nav.prev").addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
      } else {
        currentIndex = products.length - productsPerView;
      }
      updateCarousel();
    });

    // Tilføjer funktionalitet til knappen for at gå til næste produkter
    document.querySelector(".carousel-nav.next").addEventListener("click", () => {
      if (currentIndex < products.length - productsPerView) {
        currentIndex += 1;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    });

    // Initialiserer carousel ved at vise de første produkter
    updateCarousel();
  } catch (error) {
    // Logger fejl, hvis noget går galt under indlæsning af billeder eller data
    console.error("Fejl ved indlæsning af produktbilleder:", error);
  }
});