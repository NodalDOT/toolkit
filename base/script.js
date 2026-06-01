document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const iframe = document.getElementById("preview");
  const buttons = document.querySelectorAll(".nav-item");
  const themeToggle = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  const applyTheme = (theme) => {
    body.dataset.theme = theme;
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
  };

  applyTheme(savedTheme || body.dataset.theme || "dark");

  const getComponentPath = (button) => {
    const { component, element } = button.dataset;

    return `./${component}/${element}/index.html`;
  };

  for (const button of buttons) {
    button.addEventListener("click", () => {
      for (const currentButton of buttons) {
        currentButton.classList.remove("_active");
      }

      button.classList.add("_active");
      iframe.src = getComponentPath(button);
    });
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });
});
