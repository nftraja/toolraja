/* TOOLRAJA FINAL UNIVERSAL STABLE */

document.addEventListener("DOMContentLoaded", function(){

  /* ================= DRAWER ================= */

/* ================= DRAWER ================= */

const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");

let scrollY = 0;

if(menuBtn && drawer && overlay){

  menuBtn.addEventListener("click", () => {

    const isActive = drawer.classList.toggle("active");
    overlay.classList.toggle("active");

    if(isActive){

      // 🔥 SAVE SCROLL POSITION
      scrollY = window.scrollY;

      // 🔥 BODY LOCK (SAFE METHOD)
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";

    }else{

      // 🔥 UNLOCK
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";

      window.scrollTo(0, scrollY);
    }

  });

  overlay.addEventListener("click", () => {

    drawer.classList.remove("active");
    overlay.classList.remove("active");

    // 🔥 UNLOCK
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";

    window.scrollTo(0, scrollY);

  });
}

  /* ================= CATEGORY PAGE LOGIC ================= */

  const toolsContainer = document.getElementById("toolsContainer");

  if(toolsContainer){

    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");

    const searchInput = document.getElementById("searchInput");
    const title = document.getElementById("categoryTitle");

    if(cat){

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

    }

  }

});


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


/* ================= INSTALL PROMPT ================= */

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById("installBtn");
  if (installBtn) {
    installBtn.style.display = "block";
  }
});

function installApp(){
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  deferredPrompt.userChoice.then(choice => {
    if (choice.outcome === "accepted") {
      console.log("App Installed");
    }
    deferredPrompt = null;
  });
}


/* ================= ZOOM BLOCK (FINAL) ================= */

// 🔥 Pinch zoom block
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

// 🔥 Double tap zoom block
let lastTouchEnd = 0;
document.addEventListener("touchend", function (event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// 🔥 Ctrl + scroll zoom block (desktop)
document.addEventListener("wheel", function(e){
  if(e.ctrlKey){
    e.preventDefault();
  }
},{ passive:false });