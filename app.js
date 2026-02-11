const toolsContainer = document.getElementById("tools-container");
const categoryContainer = document.getElementById("category-container");
const searchInput = document.getElementById("search-input");

let allTools = [];
let currentCategory = "all";

document.addEventListener("DOMContentLoaded", loadTools);

async function loadTools() {
  const res = await fetch("tools.json");
  const data = await res.json();

  allTools = Object.values(data.tools);
  renderCategories();
  renderTools();
}

function renderCategories() {
  const categories = ["all", ...new Set(allTools.map(t => t.category))];

  categoryContainer.innerHTML = categories.map(cat =>
    `<button class="category-btn ${cat === "all" ? "active" : ""}" 
     data-category="${cat}">
     ${cat}
     </button>`
  ).join("");

  categoryContainer.addEventListener("click", e => {
    if (!e.target.classList.contains("category-btn")) return;

    document.querySelectorAll(".category-btn")
      .forEach(btn => btn.classList.remove("active"));

    e.target.classList.add("active");
    currentCategory = e.target.dataset.category;
    renderTools();
  });
}

function renderTools() {
  let filtered = allTools;

  if (currentCategory !== "all") {
    filtered = filtered.filter(t => t.category === currentCategory);
  }

  const query = searchInput.value?.toLowerCase() || "";
  if (query) {
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
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

searchInput.addEventListener("input", renderTools);