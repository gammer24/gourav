const aiProducts = [
  {
    id: 1,
    name: "KiranAI Copilot",
    category: "Copilots",
    icon: "AI",
    description: "A secure assistant UI that answers questions, drafts content, and guides employees through complex workflows.",
    features: ["Prompt library", "Role-based answers", "Human approval queue"]
  },
  {
    id: 2,
    name: "InsightPulse Analytics",
    category: "Analytics",
    icon: "IP",
    description: "Interactive dashboards that turn operational data into forecasts, alerts, and plain-language insights.",
    features: ["Predictive charts", "Natural language summaries", "KPI anomaly alerts"]
  },
  {
    id: 3,
    name: "FlowForge Automation",
    category: "Automation",
    icon: "FF",
    description: "A visual JavaScript workflow builder for approvals, notifications, document routing, and AI task triggers.",
    features: ["Drag-and-drop flows", "API connectors", "Audit history"]
  },
  {
    id: 4,
    name: "VisionDesk Review",
    category: "Computer Vision",
    icon: "VD",
    description: "Image and document review screens that help teams detect patterns, classify files, and speed up quality checks.",
    features: ["Document extraction", "Image labels", "Reviewer workspace"]
  },
  {
    id: 5,
    name: "SupportSense CX",
    category: "Copilots",
    icon: "CX",
    description: "Customer support AI interface with suggested replies, ticket triage, sentiment detection, and knowledge search.",
    features: ["Ticket prioritization", "Smart replies", "Knowledge base search"]
  },
  {
    id: 6,
    name: "LaunchPad UI Kit",
    category: "UI Framework",
    icon: "UI",
    description: "Reusable JavaScript components for prompt panels, chat widgets, dashboards, forms, and enterprise AI controls.",
    features: ["Accessible components", "Theme tokens", "Responsive layouts"]
  }
];

const state = {
  category: "All",
  search: ""
};

const productGrid = document.getElementById("productGrid");
const categoryFilters = document.getElementById("categoryFilters");
const productTemplate = document.getElementById("productCardTemplate");
const searchInput = document.getElementById("searchInput");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const typedPrompt = document.getElementById("typedPrompt");

const categories = ["All", ...new Set(aiProducts.map((product) => product.category))];
const promptSamples = [
  "Generate a JavaScript dashboard for sales predictions...",
  "Summarize open support tickets by customer risk...",
  "Create an approval workflow for vendor onboarding...",
  "Design a finance copilot with audit-ready responses..."
];

function getVisibleProducts() {
  const search = state.search.trim().toLowerCase();

  return aiProducts.filter((product) => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const searchableText = [product.name, product.category, product.description, ...product.features]
      .join(" ")
      .toLowerCase();

    return matchesCategory && searchableText.includes(search);
  });
}

function renderCategories() {
  categoryFilters.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-pill${category === state.category ? " active" : ""}`;
    button.textContent = category;
    button.setAttribute("aria-pressed", String(category === state.category));
    button.addEventListener("click", () => {
      state.category = category;
      renderCategories();
      renderProducts();
    });

    categoryFilters.appendChild(button);
  });
}

function renderProducts() {
  const products = getVisibleProducts();
  productGrid.innerHTML = "";

  if (products.length === 0) {
    productGrid.innerHTML = `
      <article class="empty-state">
        <h3>No AI products found</h3>
        <p>Try a different keyword or category to discover more Kiran Software solutions.</p>
      </article>
    `;
    return;
  }

  products.forEach((product) => {
    const card = productTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".product-icon").textContent = product.icon;
    card.querySelector(".product-category").textContent = product.category;
    card.querySelector(".product-name").textContent = product.name;
    card.querySelector(".product-description").textContent = product.description;

    const featureList = card.querySelector(".feature-list");
    product.features.forEach((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      featureList.appendChild(item);
    });

    card.querySelector(".product-action").addEventListener("click", () => {
      state.search = product.category.toLowerCase();
      searchInput.value = product.category;
      typedPrompt.textContent = `Show me a ${product.name} workflow for my team...`;
      renderProducts();
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    });

    productGrid.appendChild(card);
  });
}

function rotatePrompt() {
  let index = 0;
  setInterval(() => {
    index = (index + 1) % promptSamples.length;
    typedPrompt.textContent = promptSamples[index];
  }, 3200);
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name").toString().trim() || "there";
  formStatus.textContent = `Thanks, ${name}. Kiran Software will prepare your AI UI roadmap.`;
  contactForm.reset();
});

renderCategories();
renderProducts();
rotatePrompt();
