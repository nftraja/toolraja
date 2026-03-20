/* TOOLRAJA FINAL UNIVERSAL STABLE */

document.addEventListener("DOMContentLoaded", function(){

  /* ================= DRAWER ================= */

  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");

  if(menuBtn && drawer && overlay){

    menuBtn.addEventListener("click", () => {

      const isActive = drawer.classList.toggle("active");
      overlay.classList.toggle("active");

      // 🔥 SAFE SCROLL LOCK
      document.body.style.overflow = isActive ? "hidden" : "";

    });

    overlay.addEventListener("click", () => {

      drawer.classList.remove("active");
      overlay.classList.remove("active");

      document.body.style.overflow = "";

    });
  }

  /* ================= CATEGORY PAGE ================= */

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

        });

    }
  }

});


/* ================= INSTALL ================= */

let deferredPrompt;

window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault();
  deferredPrompt=e;

  const btn=document.getElementById("installBtn");
  if(btn) btn.style.display="block";
});

function installApp(){
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
}

/* ================= SERVICE WORKER ================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js")
      .then(function () {
        console.log("Service Worker Registered");
      })
      .catch(function (error) {
        console.log("Service Worker Registration Failed:", error);
      });
  });
}

/* ================= ZOOM BLOCK ================= */

document.addEventListener("gesturestart",e=>e.preventDefault());

let lastTouchEnd=0;
document.addEventListener("touchend",e=>{
  const now=Date.now();
  if(now-lastTouchEnd<=300) e.preventDefault();
  lastTouchEnd=now;
});

document.addEventListener("wheel",e=>{
  if(e.ctrlKey) e.preventDefault();
},{passive:false});