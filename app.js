/* ===== ZOOM SAFE ===== */
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

document.addEventListener('touchmove', function (e) {
  if (e.scale && e.scale !== 1) {
    e.preventDefault();
  }
}, { passive: false });

/* ===== Drawer ===== */
document.addEventListener("DOMContentLoaded", function(){

  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");

  if(menuBtn && drawer && overlay){
    menuBtn.addEventListener("click", function(){
      drawer.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", function(){
      drawer.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

});

/* ===== CATEGORY LOGIC ===== */
if(window.location.pathname.includes("category.html")){

  document.addEventListener("DOMContentLoaded", async function(){

    const params = new URLSearchParams(window.location.search);
    let currentCategory = params.get("cat");

    const slugMap = {
      "ai": "ai-tools",
      "nocode": "no-code"
    };

    if(slugMap[currentCategory]){
      currentCategory = slugMap[currentCategory];
    }

    const toolsContainer = document.getElementById("toolsContainer");
    const searchInput = document.getElementById("searchInput");
    const categoryTitle = document.getElementById("categoryTitle");

    if(!currentCategory || !toolsContainer) return;

    try{

      const res = await fetch("./tools.json?v=5");
      const allTools = await res.json();

      function renderTools(){

        let filtered = allTools.filter(t => t.category === currentCategory);

        const query = searchInput ? searchInput.value.toLowerCase() : "";

        if(query){
          filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
          );
        }

        if(!filtered.length){
          toolsContainer.innerHTML =
            "<div class='glass-card'>No tools found.</div>";
          return;
        }

        toolsContainer.innerHTML = filtered.map(tool => `
          <div class="tool-card">
            <div class="tool-header">
              <span class="tool-icon">${tool.icon || "🧩"}</span>
              <h3>${tool.name}</h3>
            </div>
            <p>${tool.description}</p>
            <a href="${tool.link}" target="_blank" class="visit-btn">
              Visit
            </a>
          </div>
        `).join("");

      }

      if(categoryTitle){
        categoryTitle.innerText =
          currentCategory.replace(/-/g," ").toUpperCase();
      }

      if(searchInput){
        searchInput.addEventListener("input", renderTools);
      }

      renderTools();

    }catch(e){
      toolsContainer.innerHTML =
        "<div class='glass-card'>Error loading tools.</div>";
    }

  });

}