// ==============================
// GLOBAL STATE
// ==============================

const state = {
  tools: [],
  filteredTools: [],
  currentCategory: "all",
  searchQuery: ""
};

// ==============================
// DOM ELEMENTS
// ==============================

const toolsContainer = document.getElementById("tools-container");
const categoryContainer = document.getElementById("category-container");
const searchInput = document.getElementById("search-input");
const themeToggle = document.getElementById("theme-toggle");

// ==============================
// INIT
// ==============================

document.addEventListener("DOMContentLoaded", async () => {
  await loadTools();
  renderCategories();
  renderTools();
  setupEvents();
  loadTheme();
});

// ==============================
// LOAD TOOLS (JSON OBJECT SAFE)
// ==============================

async function loadTools() {
  try {
    const res = await fetch("tools.json");
    const data = await res.json();

    // Convert object to array
    state.tools = Object.values(data.tools);
    state.filteredTools = state.tools;

  } catch (err) {
    toolsContainer.innerHTML = "<p>Failed to load tools.</p>";
  }
}

// ==============================
// RENDER CATEGORIES
// ==============================

function renderCategories() {
  const categories = [
    "all",
    ...new Set(state.tools.map(tool => tool.category))
  ];

  categoryContainer.innerHTML = categories
    .map(cat => `
      <button class="category-btn ${cat === "all" ? "active" : ""}" 
        data-category="${cat}">
        ${capitalize(cat.replace("-", " "))}
      </button>
    `)
    .join("");
}

// ==============================
// RENDER TOOLS
// ==============================

function renderTools() {
  let filtered = [...state.tools];

  // Category filter
  if (state.currentCategory !== "all") {
    filtered = filtered.filter(
      tool => tool.category === state.currentCategory
    );
  }

  // Search filter
  if (state.searchQuery) {
    filtered = filtered.filter(tool =>
      tool.name.toLowerCase().includes(state.searchQuery) ||
      tool.description.toLowerCase().includes(state.searchQuery)
    );
  }

  state.filteredTools = filtered;

  if (!filtered.length) {
    toolsContainer.innerHTML = "<p class='empty-state'>No tools found.</p>";
    return;
  }

  toolsContainer.innerHTML = filtered
    .map(tool => `
      <div class="tool-card">
        <div class="tool-header">
          <h3>${tool.name}</h3>
          <span class="price ${tool.type}">
            ${tool.pricing}
          </span>
        </div>

        <p class="tool-description">
          ${tool.description}
        </p>

        <div class="tool-footer">
          <span class="badge">
            ${capitalize(tool.category.replace("-", " "))}
          </span>

          <a href="${tool.link}" 
             target="_blank" 
             rel="noopener"
             class="visit-btn">
            Visit
          </a>
        </div>
      </div>
    `)
    .join("");
}

// ==============================
// EVENTS
// ==============================

function setupEvents() {

  // Category click
  categoryContainer.addEventListener("click", e => {
    if (!e.target.classList.contains("category-btn")) return;

    document.querySelectorAll(".category-btn")
      .forEach(btn => btn.classList.remove("active"));

    e.target.classList.add("active");

    state.currentCategory = e.target.dataset.category;
    renderTools();
  });

  // Search
  searchInput.addEventListener("input", e => {
    state.searchQuery = e.target.value.toLowerCase();
    renderTools();
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
  });
}

// ==============================
// LOAD THEME
// ==============================

function loadTheme() {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    document.body.classList.add("dark-mode");
  }
}

// ==============================
// UTILS
// ==============================

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}