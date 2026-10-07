const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");

const applyTheme = (theme) => {
  body.dataset.theme = theme;
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
};

export const initTheme = () => {
  applyTheme(body.dataset.theme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });
};
