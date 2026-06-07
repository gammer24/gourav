const products = [
  {
    id: 1,
    name: "AeroBeat Headphones",
    category: "Tech",
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    badge: "Best Seller",
    description: "Noise-cancelling wireless headphones with 40-hour battery life and rich studio sound."
  },
  {
    id: 2,
    name: "Luma Smartwatch",
    category: "Tech",
    price: 199,
    originalPrice: 249,
    rating: 4.7,
    badge: "New",
    description: "A lightweight smartwatch with fitness tracking, message sync, and premium metal finish."
  },
  {
    id: 3,
    name: "Urban Drift Sneakers",
    category: "Fashion",
    price: 89,
    originalPrice: 119,
    rating: 4.6,
    badge: "Hot",
    description: "Breathable everyday sneakers designed for comfort, movement, and modern street style."
  },
  {
    id: 4,
    name: "Minimal Leather Tote",
    category: "Fashion",
    price: 129,
    originalPrice: 169,
    rating: 4.9,
    badge: "Limited",
    description: "Elegant handcrafted tote bag with soft leather texture and spacious inner compartments."
  },
  {
    id: 5,
    name: "Glow Desk Lamp",
    category: "Home",
    price: 59,
    originalPrice: 79,
    rating: 4.5,
    badge: "Trending",
    description: "Adjustable ambient lamp with touch controls, warm light modes, and minimalist design."
  },
  {
    id: 6,
    name: "BrewCraft Coffee Set",
    category: "Home",
    price: 74,
    originalPrice: 99,
    rating: 4.8,
    badge: "Gift Pick",
    description: "A premium pour-over coffee starter set with glass carafe, dripper, and filters included."
  },
  {
    id: 7,
    name: "PixelPro 4K Webcam",
    category: "Tech",
    price: 119,
    originalPrice: 159,
    rating: 4.7,
    badge: "Creator Pick",
    description: "Ultra-clear webcam for meetings and streaming with auto-focus and built-in stereo microphones."
  },
  {
    id: 8,
    name: "Terra Ceramic Planter",
    category: "Home",
    price: 34,
    originalPrice: 44,
    rating: 4.4,
    badge: "Eco",
    description: "Textured ceramic planter that adds a calm natural accent to desks, windows, and living rooms."
  }
];

const state = {
  selectedCategory: "All",
  searchTerm: "",
  cart: []
};

const categoryFilters = document.getElementById("categoryFilters");
const productGrid = document.getElementById("productGrid");
const productCardTemplate = document.getElementById("productCardTemplate");
const resultsInfo = document.getElementById("resultsInfo");
const searchInput = document.getElementById("searchInput");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotalValue = document.getElementById("subtotalValue");
const totalValue = document.getElementById("totalValue");
const cartPanel = document.getElementById("cartPanel");
const cartToggle = document.getElementById("cartToggle");
const closeCartButton = document.getElementById("closeCartButton");
const shopNowButton = document.getElementById("shopNowButton");
const browseDealsButton = document.getElementById("browseDealsButton");
const featuredButton = document.getElementById("featuredButton");
const checkoutButton = document.getElementById("checkoutButton");

const categories = ["All", ...new Set(products.map((product) => product.category))];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function getFilteredProducts() {
  return products.filter((product) => {
    const matchesCategory =
      state.selectedCategory === "All" || product.category === state.selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(state.searchTerm) ||
      product.category.toLowerCase().includes(state.searchTerm);

    return matchesCategory && matchesSearch;
  });
}

function renderCategories() {
  categoryFilters.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `filter-pill ${category === state.selectedCategory ? "active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      state.selectedCategory = category;
      renderCategories();
      renderProducts();
    });
    categoryFilters.appendChild(button);
  });
}

function addToCart(productId) {
  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    state.cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function updateQuantity(productId, change) {
  const item = state.cart.find((product) => product.id === productId);
  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((product) => product.id !== productId);
  }

  renderCart();
}

function removeItem(productId) {
  state.cart = state.cart.filter((product) => product.id !== productId);
  renderCart();
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  productGrid.innerHTML = "";

  resultsInfo.textContent =
    filteredProducts.length === products.length
      ? "Showing all products"
      : `Showing ${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`;

  filteredProducts.forEach((product, index) => {
    const card = productCardTemplate.content.firstElementChild.cloneNode(true);
    card.style.animationDelay = `${index * 70}ms`;
    card.querySelector(".product-badge").textContent = product.badge;
    card.querySelector(".product-category").textContent = product.category;
    card.querySelector(".product-rating").textContent = `Rating ${product.rating}/5`;
    card.querySelector(".product-name").textContent = product.name;
    card.querySelector(".product-description").textContent = product.description;
    card.querySelector(".product-price").textContent = formatCurrency(product.price);
    card.querySelector(".product-original-price").textContent = formatCurrency(product.originalPrice);
    card.querySelector(".add-to-cart-button").addEventListener("click", () => addToCart(product.id));

    productGrid.appendChild(card);
  });

  if (filteredProducts.length === 0) {
    const emptyState = document.createElement("article");
    emptyState.className = "empty-cart";
    emptyState.innerHTML = `
      <h4>No products found</h4>
      <p>Try another search term or switch to a different category.</p>
    `;
    productGrid.appendChild(emptyState);
  }
}

function renderCart() {
  cartItems.innerHTML = "";

  if (state.cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h4>Your cart is empty</h4>
        <p>Add a few items to see your order summary here.</p>
      </div>
    `;
  } else {
    state.cart.forEach((item) => {
      const cartItem = document.createElement("article");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="cart-item-top">
          <div>
            <h4>${item.name}</h4>
            <p>${item.category}</p>
          </div>
          <strong>${formatCurrency(item.price * item.quantity)}</strong>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button type="button" data-action="decrease">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase">+</button>
          </div>
          <button class="remove-button" type="button">Remove</button>
        </div>
      `;

      cartItem
        .querySelector('[data-action="decrease"]')
        .addEventListener("click", () => updateQuantity(item.id, -1));
      cartItem
        .querySelector('[data-action="increase"]')
        .addEventListener("click", () => updateQuantity(item.id, 1));
      cartItem.querySelector(".remove-button").addEventListener("click", () => removeItem(item.id));

      cartItems.appendChild(cartItem);
    });
  }

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = count;
  subtotalValue.textContent = formatCurrency(subtotal);
  totalValue.textContent = formatCurrency(subtotal);
}

function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}

searchInput.addEventListener("input", (event) => {
  state.searchTerm = event.target.value.trim().toLowerCase();
  renderProducts();
});

cartToggle.addEventListener("click", () => {
  const isOpen = cartPanel.classList.contains("open");
  if (isOpen) {
    closeCart();
  } else {
    openCart();
  }
});

closeCartButton.addEventListener("click", closeCart);

shopNowButton.addEventListener("click", () => {
  document.querySelector(".products-section").scrollIntoView({ behavior: "smooth" });
});

browseDealsButton.addEventListener("click", () => {
  document.querySelector(".promo-grid").scrollIntoView({ behavior: "smooth" });
});

featuredButton.addEventListener("click", () => {
  state.selectedCategory = "Tech";
  renderCategories();
  renderProducts();
  document.querySelector(".products-section").scrollIntoView({ behavior: "smooth" });
});

checkoutButton.addEventListener("click", () => {
  if (state.cart.length === 0) {
    alert("Your cart is empty. Add products before checkout.");
    return;
  }

  alert("Demo checkout complete! This storefront is ready for backend integration.");
});

renderCategories();
renderProducts();
renderCart();
