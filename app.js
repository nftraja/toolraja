/* TOOLRAJA FINAL UNIVERSAL SAFE */

document.addEventListener("DOMContentLoaded", function(){

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

  const toolsContainer = document.getElementById("toolsContainer");
  if(!toolsContainer) return;

  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");

  const searchInput = document.getElementById("searchInput");
  const title = document.getElementById("categoryTitle");

  if(!cat) return;

  // ✅ RELATIVE PATH (WORKS EVERYWHERE)
  fetch("tools.json", { cache: "no-store" })
    .then(res => {
      if(!res.ok) throw new Error("tools.json not found");
      return res.json();
    })
    .then(data => {

      function render(){

        let filtered = data.filter(t => t.category === cat);

        if(searchInput && searchInput.value){
          const q = searchInput.value.toLowerCase();
          filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
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
    .catch(err=>{
      console.error(err);
      toolsContainer.innerHTML =
        "<div class='glass-card'>Error loading tools.</div>";
    });

});