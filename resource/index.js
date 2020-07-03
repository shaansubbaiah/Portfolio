//              Dark mode toggle
// @SEE https://ryanfeigenbaum.com/dark-mode/
//
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
