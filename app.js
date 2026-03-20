/* TOOLRAJA FINAL CLEAN STABLE JS */

document.addEventListener("DOMContentLoaded", function(){

  /* 🔥 RESET BODY LOCK */
  document.body.style.overflow = "";

  /* ================= DRAWER ================= */

  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");

  function openDrawer(){
    drawer.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer(){
    drawer.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if(menuBtn && drawer && overlay){
    menuBtn.addEventListener("click", openDrawer);
    overlay.addEventListener("click", closeDrawer);
  }

  /* 🔥 BACK BUTTON FIX */
  const backBtn = document.getElementById("drawerBackBtn");
  if(backBtn){
    backBtn.addEventListener("click", function(e){
      e.preventDefault();
      closeDrawer();
    });
  }

  /* 🔥 DRAWER LINKS FIX (NO REDIRECT BUG) */
  const drawerLinks = document.querySelectorAll(".drawer a");

  drawerLinks.forEach(link => {
    link.addEventListener("click", function(){
      closeDrawer();
      // ⚠️ IMPORTANT: navigation allow (NO preventDefault)
    });
  });

  /* ================= CATEGORY ================= */

  const toolsContainer = document.getElementById("toolsContainer");

  if(toolsContainer){

    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");

    const searchInput = document.getElementById("searchInput");
    const title = document.getElementById("categoryTitle");

    if(cat){

      fetch("tools.json",{cache:"no-store"})
        .then(res => res.json())
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
                  <span>${tool.icon || "🧩"}</span>
                  <h3>${tool.name}</h3>
                </div>
                <p>${tool.description}</p>
                <a href="${tool.link}" target="_blank" class="visit-btn">Visit</a>
              </div>
            `).join("");
          }

          if(title){
            title.innerText = cat.toUpperCase();
          }

          if(searchInput){
            searchInput.addEventListener("input", render);
          }

          render();

        })
        .catch(()=>{
          toolsContainer.innerHTML =
            "<div class='glass-card'>Error loading tools.</div>";
        });

    }
  }

});

/* ================= INSTALL ================= */

let deferredPrompt = null;

/* 🔥 CAPTURE INSTALL EVENT */
window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault();
  deferredPrompt = e;
});

/* 🔥 INSTALL BUTTON CLICK */
document.addEventListener("click", function(e){

  const btn = e.target.closest("#installBtn");
  if(!btn) return;

  if(deferredPrompt){

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(choice=>{
      if(choice.outcome === "accepted"){
        console.log("✅ Installed");
      }
      deferredPrompt = null;
    });

  }else{
    alert("Install not available yet.\nOpen in Chrome & interact more.");
  }

});

/* ================= ZOOM BLOCK ================= */

// pinch zoom block
document.addEventListener("gesturestart",e=>e.preventDefault());

// double tap zoom block
let lastTouchEnd=0;
document.addEventListener("touchend",e=>{
  const now=Date.now();
  if(now-lastTouchEnd<=300) e.preventDefault();
  lastTouchEnd=now;
});

// ctrl + scroll zoom block
document.addEventListener("wheel",e=>{
  if(e.ctrlKey) e.preventDefault();
},{passive:false});