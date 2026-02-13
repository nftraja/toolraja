document.addEventListener('touchmove',function(e){
 if(e.scale && e.scale!==1){e.preventDefault();}
},{passive:false});

let lastTouchEnd=0;
document.addEventListener('touchend',function(e){
 const now=Date.now();
 if(now-lastTouchEnd<=300){e.preventDefault();}
 lastTouchEnd=now;
},false);

const menuBtn=document.getElementById("menuBtn");
const drawer=document.getElementById("drawer");
const overlay=document.getElementById("overlay");

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
  track.scrollBy({left:direction*250,behavior:"smooth"});
 }
}