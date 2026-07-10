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

  const getButtonKey = (button) =>
    `${button.dataset.component}/${button.dataset.element}`;

  const findButtonByKey = (key) => {
    if (!key) {
      return null;
    }

    return (
      Array.from(buttons).find((button) => getButtonKey(button) === key) || null
    );
  };

  const updateUrl = (button) => {
    const url = new URL(window.location.href);

    url.searchParams.set("component", button.dataset.component);
    url.searchParams.set("element", button.dataset.element);

    window.history.replaceState({}, "", url);
  };

  const setActiveButton = (activeButton) => {
    for (const currentButton of buttons) {
      currentButton.classList.toggle("_active", currentButton === activeButton);
    }
  };

  const openComponent = (button, { updateHistory = true } = {}) => {
    if (!button) {
      return;
    }

    setActiveButton(button);
    iframe.src = getComponentPath(button);

    if (updateHistory) {
      updateUrl(button);
    }

    if (mobileMedia.matches) {
      window.clearTimeout(sidebarTransitionTimer);
      body.dataset.sidebarContent = "hidden";
      applySidebarState("collapsed");
      localStorage.setItem("sidebar", "collapsed");
    }
  };

  const getButtonFromUrl = () => {
    const url = new URL(window.location.href);
    const component = url.searchParams.get("component");
    const element = url.searchParams.get("element");

    if (!component || !element) {
      return null;
    }

    return findButtonByKey(`${component}/${element}`);
  };

  for (const button of buttons) {
    button.addEventListener("click", () => {
      openComponent(button);
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

  const initialButton = getButtonFromUrl() || buttons[0] || null;

  openComponent(initialButton, { updateHistory: Boolean(getButtonFromUrl()) });

  window.addEventListener("popstate", () => {
    const button = getButtonFromUrl() || buttons[0] || null;

    openComponent(button, { updateHistory: false });
  });
});
