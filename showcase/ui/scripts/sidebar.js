const body = document.body;
const aside = document.querySelector("aside");
const asideToggle = document.querySelector(".sidebar-toggle-aside");
const headerStart = document.querySelector(".header-start");
const headerToggle = document.querySelector(".sidebar-toggle-header");
const sidebarToggles = document.querySelectorAll(".sidebar-toggle");
const mobileMedia = window.matchMedia("(max-width: 768px)");

const moveFocusFrom = (container, target) => {
  if (container.contains(document.activeElement)) {
    target.focus();
  }
};

const saveSidebarState = (state) => {
  body.dataset.sidebar = state;
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

export const isSidebarExpanded = () => body.dataset.sidebar === "expanded";

export const collapseSidebarOnMobile = () => {
  if (mobileMedia.matches) {
    saveSidebarState("collapsed");
  }
};

export const initSidebar = () => {
  for (const sidebarToggle of sidebarToggles) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }
};
