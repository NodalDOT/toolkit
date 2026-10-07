import { collapseSidebarOnMobile } from "../sidebar.js";
import { revealItem } from "./groups.js";

const iframe = document.getElementById("preview");
const items = Array.from(document.querySelectorAll(".nav-item"));

const getItemPath = (item) => item.dataset.path;

const getItemUrl = (item) => `./snippets/${getItemPath(item)}/index.html`;

const findItemByPath = (itemPath) =>
  items.find((item) => getItemPath(item) === itemPath);

const getItemFromUrl = () => {
  const url = new URL(window.location.href);

  return findItemByPath(url.searchParams.get("item"));
};

const updateUrl = (item) => {
  const url = new URL(window.location.href);

  url.searchParams.set("item", getItemPath(item));

  window.history.replaceState({}, "", url);
};

const setActiveItem = (activeItem) => {
  for (const item of items) {
    item.disabled = item === activeItem;
  }
};

export const openItem = (item, { updateHistory = true } = {}) => {
  if (!item || item.disabled) {
    return;
  }

  setActiveItem(item);
  revealItem(item);
  iframe.src = getItemUrl(item);

  if (updateHistory) {
    updateUrl(item);
  }

  collapseSidebarOnMobile();
};

export const revealActiveItem = () => {
  const activeItem = items.find((item) => item.disabled);

  if (activeItem) {
    revealItem(activeItem);
  }
};

export const initNavItems = () => {
  for (const item of items) {
    item.addEventListener("click", () => {
      openItem(item);
    });
  }

  openItem(getItemFromUrl() || items[0], { updateHistory: false });
};
