import { isSidebarExpanded } from "../sidebar.js";
import { filterGroups, resetGroups } from "./groups.js";
import { openItem, revealActiveItem } from "./items.js";

const navFilter = document.querySelector(".nav-filter");
const navEmpty = document.querySelector(".nav-empty");
const items = Array.from(document.querySelectorAll(".nav-item"));
let isFiltering = false;

const isVisible = (item) => !item.parentElement.hidden;

const matchesQuery = (item, query) =>
  `${item.dataset.title} ${item.dataset.path}`.toLowerCase().includes(query);

const isTyping = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA"].includes(target.tagName));

const applyFilter = () => {
  const query = navFilter.value.trim().toLowerCase();
  const wasFiltering = isFiltering;

  isFiltering = Boolean(query);

  for (const item of items) {
    item.parentElement.hidden = isFiltering && !matchesQuery(item, query);
  }

  navEmpty.hidden = !isFiltering || items.some(isVisible);

  if (isFiltering) {
    filterGroups();
    return;
  }

  if (wasFiltering) {
    resetGroups();
    revealActiveItem();
  }
};

export const initNavFilter = () => {
  navFilter.addEventListener("input", applyFilter);

  navFilter.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      openItem(items.find(isVisible));
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !isTyping(event.target) && isSidebarExpanded()) {
      event.preventDefault();
      navFilter.focus();
    }
  });
};
