document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const iframe = document.getElementById("preview");
  const buttons = document.querySelectorAll(".nav-item");
  const themeToggle = document.querySelector(".theme-toggle");
  const sidebarToggles = document.querySelectorAll(".sidebar-toggle");
  const savedTheme = localStorage.getItem("theme");
  const savedSidebar = localStorage.getItem("sidebar");
  const mobileMedia = window.matchMedia("(max-width: 768px)");
  const sidebarContentTransitionMs = 160;
  let sidebarTransitionTimer;

  const applyTheme = (theme) => {
    body.dataset.theme = theme;
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
  };

  const applySidebarState = (state) => {
    body.dataset.sidebar = state;

    for (const sidebarToggle of sidebarToggles) {
      sidebarToggle.setAttribute(
        "aria-label",
        state === "collapsed" ? "Expand sidebar" : "Collapse sidebar",
      );
    }
  };

  const syncSidebarContentVisibility = (state) => {
    body.dataset.sidebarContent = state === "collapsed" ? "hidden" : "visible";
  };

  const toggleSidebar = () => {
    window.clearTimeout(sidebarTransitionTimer);

    if (body.dataset.sidebar === "collapsed") {
      applySidebarState("expanded");
      body.dataset.sidebarContent = "hidden";

      sidebarTransitionTimer = window.setTimeout(() => {
        body.dataset.sidebarContent = "visible";
      }, sidebarContentTransitionMs);

      localStorage.setItem("sidebar", "expanded");
      return;
    }

    body.dataset.sidebarContent = "hidden";

    sidebarTransitionTimer = window.setTimeout(() => {
      applySidebarState("collapsed");
      localStorage.setItem("sidebar", "collapsed");
    }, sidebarContentTransitionMs);
  };

  applyTheme(savedTheme || body.dataset.theme || "dark");
  applySidebarState(
    savedSidebar ||
      (mobileMedia.matches ? "collapsed" : body.dataset.sidebar) ||
      "expanded",
  );
  syncSidebarContentVisibility(body.dataset.sidebar);

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

      if (mobileMedia.matches) {
        window.clearTimeout(sidebarTransitionTimer);
        body.dataset.sidebarContent = "hidden";
        applySidebarState("collapsed");
        localStorage.setItem("sidebar", "collapsed");
      }
    });
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });

  for (const sidebarToggle of sidebarToggles) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }
});
