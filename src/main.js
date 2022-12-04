import "./style.css";

//          Dark mode toggle
// @SEE https://ryanfeigenbaum.com/dark-mode/
if (window.CSS && CSS.supports("color", "var(--primary)")) {
  var toggleColorMode = function toggleColorMode(e) {
    // Switch to Light Mode
    if (e.currentTarget.classList.contains("light--hidden")) {
      // Sets the custom html attribute
      document.documentElement.setAttribute("color-mode", "light");

      // Sets the user's preference in local storage
      localStorage.setItem("color-mode", "light");
      return;
    }
    /* Switch to Dark Mode
    Sets the custom html attribute */
    document.documentElement.setAttribute("color-mode", "dark");

    // Sets the user's preference in local storage
    localStorage.setItem("color-mode", "dark");
  }; // Get the buttons in the DOM

  var toggleColorButtons = document.querySelectorAll(".color-mode-btn"); // Set up event listeners

  toggleColorButtons.forEach(function (btn) {
    btn.addEventListener("click", toggleColorMode);
  });
} else {
  // If the feature isn't supported, then we hide the toggle buttons
  var btnContainer = document.querySelector(".color-mode-toggle");
  btnContainer.style.display = "none";
}

//          Masonry for the repository cards
// @SEE https://masonry.desandro.com/
let msnry = new Masonry(".grid", {
  itemSelector: ".grid-item",
  gutter: 20,
  horizontalOrder: true,
  columnWidth: 350,
  fitWidth: true,
});

// Force masonry reload once page is ready to prevent overlap
window.onload = function () {
  msnry.layout();
};

window.onresize = function () {
  msnry.layout();
};

// Handle avatar click animation
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

let avatarClickCount = 0;
document.getElementById("pf-img-source").onclick = function avatarClick() {
  avatarClickCount += 1;
  if (avatarClickCount == 3) {
    // @SEE github.com/catdad/canvas-confetti
    confetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: getRandomArbitrary(0.2, 0.8),
        y: getRandomArbitrary(0.1, 0.6),
      },
    });
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 20,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
    console.log("Ahah! 🥚🐇🎊");
    avatarClickCount = 0;
  }
};
