const cursor = document.querySelector(".custom-cursor");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const hoverTargets = document.querySelectorAll("a, button, [data-cursor-hover]");

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

function moveCursor(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  cursor.classList.add("is-visible");
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
}

function animateRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;

  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
}

hoverTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => {
    cursor.classList.add("is-hovering");
  });

  target.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-hovering");
  });
});

document.addEventListener("mousemove", moveCursor);
document.addEventListener("mouseleave", () => {
  cursor.classList.remove("is-visible", "is-hovering");
});

animateRing();
