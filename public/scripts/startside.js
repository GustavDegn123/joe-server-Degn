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

    const button = document.createElement("button");
    button.classList.add("add-to-basket");
    button.textContent = "Add to Basket";
    button.addEventListener("click", () => {
      addToBasketAndRedirect(product);
    });

    productCard.appendChild(img);
    productCard.appendChild(title);
    productCard.appendChild(button);

    document.querySelector(".carousel").appendChild(productCard);
  });

  function addToBasketAndRedirect(product) {
    setCookie("selectedProduct", JSON.stringify(product), 1);
    window.location.href = "/ordernow"; // Redirect to MENU page
  }

  // Helper function to set cookies
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
  }
});