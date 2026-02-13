/* ===============================
   TOOLRAJA FINAL CLEAN APP.JS
================================ */

/* ===== Prevent Pinch Zoom Only ===== */
document.addEventListener('touchmove', function (event) {
  if (event.scale && event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });

/* ===== Drawer Toggle ===== */
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


/* ===== Carousel Scroll ===== */
function scrollCarousel(direction){
  const track = document.getElementById("carouselTrack");
  if(!track) return;

  const scrollAmount = 260;
  track.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });
}


/* ===============================
   CATEGORY PAGE LOGIC (FINAL)
================================ */

document.addEventListener("DOMContentLoaded", async function(){

  if(!window.location.pathname.includes("category.html")) return;

  const params = new URLSearchParams(window.location.search);
  let currentCategory = params.get("cat");

  const toolsContainer = document.getElementById("toolsContainer");
  const searchInput = document.getElementById("searchInput");
  const categoryTitle = document.getElementById("categoryTitle");

  if(!currentCategory || !toolsContainer) return;

  /* ---- SLUG NORMALIZATION ---- */
  const slugMap = {
    "ai": "ai-tools",
    "nocode": "no-code"
  };

  currentCategory = slugMap[currentCategory] || currentCategory;

  try{

    const res = await fetch("tools.json");
    const allTools = await res.json();

    function renderTools(){

      let filtered = allTools.filter(
        t => t.category === currentCategory
      );

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