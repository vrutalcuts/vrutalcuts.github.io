const titleText = "@inclemencyglows";
const typingSpeed = 160;
const pauseTime = 900;

let currentLength = titleText.length;
let direction = -1;

function animateTitle() {
  document.title = titleText.slice(0, currentLength) || " ";

  if (currentLength === 0) {
    direction = 1;
    currentLength += direction;
    setTimeout(animateTitle, pauseTime);
    return;
  }

  if (currentLength === titleText.length) {
    direction = -1;
    currentLength += direction;
    setTimeout(animateTitle, pauseTime);
    return;
  }

  currentLength += direction;
  setTimeout(animateTitle, typingSpeed);
}

animateTitle();
