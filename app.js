/* ===== Disable Zoom (Pinch + Double Tap) ===== */

// Prevent pinch zoom
document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });

// Prevent double tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");

if(menuBtn){
 menuBtn.addEventListener("click",()=>{
  drawer.classList.toggle("active");
  overlay.classList.toggle("active");
 });
}

if(overlay){
 overlay.addEventListener("click",()=>{
  drawer.classList.remove("active");
  overlay.classList.remove("active");
 });
}

function scrollCarousel(direction){
 const track=document.getElementById("carouselTrack");
 if(track){
  track.scrollBy({left:direction*300,behavior:"smooth"});
 }
}