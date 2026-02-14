/* TOOLRAJA FINAL LOCKED JS */

document.addEventListener("DOMContentLoaded", function(){

  // Drawer
  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");

  if(menuBtn && drawer && overlay){
    menuBtn.onclick = () => {
      drawer.classList.toggle("active");
      overlay.classList.toggle("active");
    };
    overlay.onclick = () => {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
    };
  }

  // Category Logic
  if(window.location.pathname.includes("category.html")){

    const params = new URLSearchParams(window.location.search);
    let cat = params.get("cat");

    const toolsContainer = document.getElementById("toolsContainer");
    const searchInput = document.getElementById("searchInput");
    const title = document.getElementById("categoryTitle");

    if(!cat || !toolsContainer) return;

    fetch("tools.json")
      .then(res => res.json())
      .then(data => {

        function render(){
          let filtered = data.filter(t => t.category === cat);

          const query = searchInput.value.toLowerCase();

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
              <a href="${tool.link}" target="_blank" class="visit-btn">Visit</a>
            </div>
          `).join("");

        }

        title.innerText = cat.replace(/-/g," ").toUpperCase();
        searchInput.addEventListener("input", render);
        render();

      })
      .catch(()=>{
        toolsContainer.innerHTML =
          "<div class='glass-card'>Error loading tools.</div>";
      });

  }

});