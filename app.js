const state = {
  tools: [],
  currentCategory: "all",
  searchQuery: ""
};

const toolsContainer = document.getElementById("tools-container");
const categoryContainer = document.getElementById("category-container");
const searchInput = document.getElementById("search-input");

document.addEventListener("DOMContentLoaded", async () => {
  await loadTools();
  renderCategories();
  renderTools();
  setupEvents();
});

async function loadTools() {
  const res = await fetch("tools.json");
  const data = await res.json();
  state.tools = Object.values(data.tools);
}

function renderCategories() {
  const categories = [
    "all",
    ...new Set(state.tools.map(tool => tool.category))
  ];

  categoryContainer.innerHTML = categories.map(cat => `
    <button class="category-btn ${cat === "all" ? "active" : ""}" 
      data-category="${cat}">
      ${cat}
    </button>
  `).join("");
}

function renderTools() {
  let filtered = state.tools;

  if (state.currentCategory !== "all") {
    filtered = filtered.filter(tool => tool.category === state.currentCategory);
  }

  if (state.searchQuery) {
    filtered = filtered.filter(tool =>
      tool.name.toLowerCase().includes(state.searchQuery)
    );
  }

  toolsContainer.innerHTML = filtered.map(tool => `
    <div class="tool-card">
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <span class="price">${tool.pricing}</span>
      <a href="${tool.link}" target="_blank" class="visit-btn">Visit</a>
    </div>
  `).join("");
}

function setupEvents() {
  categoryContainer.addEventListener("click", e => {
    if (!e.target.classList.contains("category-btn")) return;

    document.querySelectorAll(".category-btn")
      .forEach(btn => btn.classList.remove("active"));

    e.target.classList.add("active");

    state.currentCategory = e.target.dataset.category;
    renderTools();
  });

  searchInput.addEventListener("input", e => {
    state.searchQuery = e.target.value.toLowerCase();
    renderTools();
  });
}