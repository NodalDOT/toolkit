const navGroups = document.querySelectorAll(".nav-group");
const navSections = document.querySelectorAll(".nav-section");
const foldToggle = document.querySelector(".nav-fold-toggle");
const storageKey = "nav-groups";
let isFiltered = false;

const readGroupStates = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
};

const saveGroupStates = () => {
  const states = {};

  for (const group of navGroups) {
    states[group.dataset.key] = group.open;
  }

  localStorage.setItem(storageKey, JSON.stringify(states));
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

export const revealItem = (item) => {
  let group = item.closest(".nav-group");

  while (group) {
    group.open = true;
    group = group.parentElement.closest(".nav-group");
  }

  item.scrollIntoView({ block: "nearest" });
};

export const filterGroups = () => {
  isFiltered = true;

  for (const group of navGroups) {
    const hasMatches = group.querySelector("li:not([hidden])") !== null;

    group.hidden = !hasMatches;
    group.open = hasMatches;
  }
};

export const resetGroups = () => {
  isFiltered = false;

  for (const group of navGroups) {
    group.hidden = false;
  }

  restoreGroupStates();
};

export const initNavGroups = () => {
  for (const group of navGroups) {
    group.addEventListener("toggle", () => {
      if (!isFiltered) {
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

  restoreGroupStates();
  syncFoldToggle();
};
