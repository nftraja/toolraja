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

      // 🔥 BODY LOCK (SAFE)
      document.body.style.overflow = isActive ? "hidden" : "";

      // 🔥 CRITICAL FIX (SCROLL WORK)
      if(isActive){
        drawer.style.touchAction = "pan-y";
      }

    });

    overlay.addEventListener("click", () => {

      drawer.classList.remove("active");
      overlay.classList.remove("active");

      document.body.style.overflow = "";

    });
  }

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
  deferredPrompt = e;

  const installBtn = document.getElementById("installBtn");

  if(installBtn){
    installBtn.style.display = "block";

    // 🔥 button click
    installBtn.addEventListener("click",(ev)=>{
      ev.stopPropagation(); // card double trigger रोकने के लिए
      installApp();
    });
  }
});

/* 🔥 MAIN INSTALL FUNCTION */
function installApp(){
  if(!deferredPrompt) return;

  deferredPrompt.prompt();

  deferredPrompt.userChoice.then(choice=>{
    if(choice.outcome === "accepted"){
      console.log("✅ App Installed");
    }
    deferredPrompt = null;
  });
}

/* ZOOM BLOCK */
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