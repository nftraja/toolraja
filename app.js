/* TOOLRAJA FINAL LOCKED JS – UNIVERSAL (GitHub + Cloudflare SAFE) */

document.addEventListener("DOMContentLoaded", function(){

  /* =============================
     Drawer Logic
  ============================== */

  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");

  if(menuBtn && drawer && overlay){
    menuBtn.addEventListener("click", () => {
      drawer.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
    });
  }


  /* =============================
     CATEGORY PAGE LOGIC
     (DOM based detection – safest)
  ============================== */

  const toolsContainer = document.getElementById("toolsContainer");

  // Only run on category page
  if(!toolsContainer) return;

  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");

  const searchInput = document.getElementById("searchInput");
  const title = document.getElementById("categoryTitle");

  if(!cat) {
    toolsContainer.innerHTML =
      "<div class='glass-card'>Invalid category.</div>";
    return;
  }

  // Relative path → works on GitHub + Cloudflare
  fetch("tools.json", { cache: "no-store" })
    .then(res => {
      if(!res.ok) throw new Error("tools.json not found");
      return res.json();
    })
    .then(data => {

      function render(){

        let filtered = data.filter(t => t.category === cat);

        if(searchInput && searchInput.value){
          const query = searchInput.value.toLowerCase();

          filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
          );
        }

        if(filtered.length === 0){
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
            <a href="${tool.link}" target="_blank" rel="noopener" class="visit-btn">
              Visit
            </a>
          </div>
        `).join("");

      }

      if(title){
        title.innerText = cat.replace(/-/g," ").toUpperCase();
      }

      if(searchInput){
        searchInput.addEventListener("input", render);
      }

      render();

    })
    .catch(error => {
      console.error(error);
      toolsContainer.innerHTML =
        "<div class='glass-card'>Error loading tools.</div>";
    });

});