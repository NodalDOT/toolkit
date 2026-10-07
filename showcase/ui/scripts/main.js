document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const iframe = document.getElementById("preview");
  const buttons = document.querySelectorAll(".nav-item");
  const themeToggle = document.querySelector(".theme-toggle");
  const sidebarToggles = document.querySelectorAll(".sidebar-toggle");
  const aside = document.querySelector("aside");
  const asideToggle = document.querySelector(".sidebar-toggle-aside");
  const headerStart = document.querySelector(".header-start");
  const headerToggle = document.querySelector(".sidebar-toggle-header");
  const mobileMedia = window.matchMedia("(max-width: 768px)");
  const navGroups = document.querySelectorAll(".nav-group");
  const navSections = document.querySelectorAll(".nav-section");
  const navFilter = document.querySelector(".nav-filter");
  const navEmpty = document.querySelector(".nav-empty");
  const foldToggle = document.querySelector(".nav-fold-toggle");
  const navGroupsStorageKey = "nav-groups";
  let isFiltering = false;

  const applyTheme = (theme) => {
    body.dataset.theme = theme;
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
  };

  const applySidebarState = (state) => {
    body.dataset.sidebar = state;
  };

  const moveFocusFrom = (container, target) => {
    if (container.contains(document.activeElement)) {
      target.focus();
    }
  };

  const saveSidebarState = (state) => {
    applySidebarState(state);
    localStorage.setItem("sidebar", state);
  };

  const toggleSidebar = () => {
    if (body.dataset.sidebar === "collapsed") {
      saveSidebarState("expanded");
      moveFocusFrom(headerStart, asideToggle);
      return;
    }

    saveSidebarState("collapsed");
    moveFocusFrom(aside, headerToggle);
  };

  applyTheme(body.dataset.theme);

  const getItemPath = (button) => button.dataset.path;

  const getItemUrl = (button) => `./snippets/${getItemPath(button)}/index.html`;

  const findButtonByPath = (itemPath) => {
    if (!itemPath) {
      return null;
    }

    return (
      Array.from(buttons).find((button) => getItemPath(button) === itemPath) ||
      null
    );
  };

  const readGroupStates = () => {
    try {
      return JSON.parse(localStorage.getItem(navGroupsStorageKey)) || {};
    } catch {
      return {};
    }
  };

  const saveGroupStates = () => {
    const states = {};

    for (const group of navGroups) {
      states[group.dataset.key] = group.open;
    }

    localStorage.setItem(navGroupsStorageKey, JSON.stringify(states));
  };

  const restoreGroupStates = () => {
    const states = readGroupStates();

    for (const group of navGroups) {
      group.open = states[group.dataset.key] ?? true;
    }
  };

  const syncFoldToggle = () => {
    const isAnyOpen = Array.from(navSections).some((section) => section.open);
    const label = isAnyOpen ? "Collapse all groups" : "Expand all groups";

    foldToggle.dataset.state = isAnyOpen ? "expanded" : "collapsed";
    foldToggle.setAttribute("aria-label", label);
    foldToggle.title = label;
  };

  const revealButton = (button) => {
    let group = button.closest(".nav-group");

    while (group) {
      group.open = true;
      group = group.parentElement.closest(".nav-group");
    }

    button.scrollIntoView({ block: "nearest" });
  };

  const applyFilter = () => {
    const query = navFilter.value.trim().toLowerCase();
    const wasFiltering = isFiltering;

    isFiltering = Boolean(query);

    if (!isFiltering) {
      for (const button of buttons) {
        button.parentElement.hidden = false;
      }

      for (const group of navGroups) {
        group.hidden = false;
      }

      navEmpty.hidden = true;

      if (wasFiltering) {
        const activeButton = document.querySelector(".nav-item._active");

        restoreGroupStates();

        if (activeButton) {
          revealButton(activeButton);
        }
      }

      return;
    }

    for (const button of buttons) {
      const text = `${button.dataset.title} ${button.dataset.path}`;

      button.parentElement.hidden = !text.toLowerCase().includes(query);
    }

    for (const group of navGroups) {
      const hasMatches = group.querySelector("li:not([hidden])") !== null;

      group.hidden = !hasMatches;
      group.open = hasMatches;
    }

    navEmpty.hidden = Array.from(buttons).some(
      (button) => !button.parentElement.hidden,
    );
  };

  const updateUrl = (button) => {
    const url = new URL(window.location.href);

    url.searchParams.set("item", getItemPath(button));

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
    revealButton(button);
    iframe.src = getItemUrl(button);

    if (updateHistory) {
      updateUrl(button);
    }

    if (mobileMedia.matches) {
      saveSidebarState("collapsed");
    }
  };

  const getButtonFromUrl = () => {
    const url = new URL(window.location.href);

    return findButtonByPath(url.searchParams.get("item"));
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

  for (const group of navGroups) {
    group.addEventListener("toggle", () => {
      if (!isFiltering) {
        saveGroupStates();
      }

      syncFoldToggle();
    });
  }

  foldToggle.addEventListener("click", () => {
    const shouldOpen = foldToggle.dataset.state === "collapsed";

    for (const group of navGroups) {
      group.open = shouldOpen;
    }
  });

  navFilter.addEventListener("input", applyFilter);

  navFilter.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const firstMatch = Array.from(buttons).find(
        (button) => !button.parentElement.hidden,
      );

      openComponent(firstMatch);
    }
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(target.tagName));

    if (event.key === "/" && !isTyping && body.dataset.sidebar === "expanded") {
      event.preventDefault();
      navFilter.focus();
    }
  });

  restoreGroupStates();
  syncFoldToggle();

  const initialButton = getButtonFromUrl() || buttons[0] || null;

  openComponent(initialButton, { updateHistory: Boolean(getButtonFromUrl()) });

  window.addEventListener("popstate", () => {
    const button = getButtonFromUrl() || buttons[0] || null;

    openComponent(button, { updateHistory: false });
  });
});
