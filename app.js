document.addEventListener("DOMContentLoaded", function(){

  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");

  if(menuBtn){
    menuBtn.onclick = () => {
      drawer.classList.toggle("active");
      overlay.classList.toggle("active");
    };
  }

  if(overlay){
    overlay.onclick = () => {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
    };
  }

  if(window.location.pathname.includes("category.html")){

    const params = new URLSearchParams(window.location.search);
    const currentCategory = params.get("cat");

    const toolsContainer = document.getElementById("toolsContainer");
    const searchInput = document.getElementById("searchInput");
    const categoryTitle = document.getElementById("categoryTitle");

    fetch("tools.json")
      .then(res => res.json())
      .then(allTools => {

        function renderTools(){

          let filtered = allTools.filter(t => t.category === currentCategory);

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
              <a href="${tool.link}" target="_blank"
                class="visit-btn">Visit</a>
            </div>
          `).join("");
        }

        categoryTitle.innerText =
          currentCategory.replace(/-/g," ").toUpperCase();

        searchInput.addEventListener("input", renderTools);
        renderTools();
      });
  }

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js');
  }

});