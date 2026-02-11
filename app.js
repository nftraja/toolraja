const state = {
  tools: [],
  filteredTools: [],
  currentCategory: "all",
  searchQuery: ""
};

const toolsContainer = document.getElementById("tools-container");
const categoryContainer = document.getElementById("category-container");
const searchInput = document.getElementById("search-input");
const themeToggle = document.getElementById("theme-toggle");

document.addEventListener("DOMContentLoaded", async () => {
  await loadTools();
  renderCategories();
  renderTools();
  setupEvents();
  loadTheme();
});

async function loadTools() {
  try {
    const res = await fetch("tools.json");
    const data = await res.json();
    state.tools = data;
    state.filteredTools = data;
  } catch (err) {
    toolsContainer.innerHTML = "<p>Error loading tools.</p>";
  }
}

function renderCategories() {
  const categories = [
    "all",
    ...new Set(state.tools.map(tool => tool.category))
  ];

  categoryContainer.innerHTML = categories
    .map(cat => `
      <button class="category-btn ${cat === "all" ? "active" : ""}" 
        data-category="${cat}">
        ${capitalize(cat)}
      </button>
    `)
    .join("");
}

function renderTools() {
  let filtered = state.tools;

  if (state.currentCategory !== "all") {
    filtered = filtered.filter(
      tool => tool.category === state.currentCategory
    );
  }

  if (state.searchQuery) {
    filtered = filtered.filter(tool =>
      tool.name.toLowerCase().includes(state.searchQuery) ||
      tool.description.toLowerCase().includes(state.searchQuery)
    );
  }

  state.filteredTools = filtered;

  if (!filtered.length) {
    toolsContainer.innerHTML = "<p>No tools found.</p>";
    return;
  }

  toolsContainer.innerHTML = filtered
    .map(tool => `
      <div class="tool-card">
        <div class="tool-header">
          <h3>${tool.name}</h3>
          <span class="price">${tool.price}</span>
        </div>
        <p>${tool.description}</p>
        <div class="tool-footer">
          <span class="badge">${capitalize(tool.category)}</span>
          <a href="${tool.link}" target="_blank" class="visit-btn">
            Visit
          </a>
        </div>
      </div>
    `)
    .join("");
}

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

function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

