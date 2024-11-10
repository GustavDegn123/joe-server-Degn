document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { title: "Serrano", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Serrano?_a=BAMCkGRg0" },
    { title: "Avocado", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Avocado?_a=BAMCkGRg0" },
    { title: "Tunacado", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1/Joe%20billeder/Tunacado?_a=BAMCkGRg0" },
    { title: "Joe's Club", imageUrl: "https://res.cloudinary.com/dut2sot5p/image/upload/v1730456097/Joe%20billeder/Joes%20Club.png" },
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

  const carousel = document.querySelector(".carousel");
  const productsPerView = 5;

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

    productCard.appendChild(img);
    productCard.appendChild(title);

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
      currentIndex -= 1; // Move by 1 product to the left
    } else {
      currentIndex = products.length - productsPerView; // Loop to the end if at start
    }
    updateCarousel();
  });

  document.querySelector(".carousel-nav.next").addEventListener("click", () => {
    if (currentIndex < products.length - productsPerView) {
      currentIndex += 1; // Move by 1 product to the right
    } else {
      currentIndex = 0; // Loop back to the start if at end
    }
    updateCarousel();
  });

  updateCarousel();
});
