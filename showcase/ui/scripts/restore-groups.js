(() => {
  const readStates = () => {
    try {
      return JSON.parse(localStorage.getItem("nav-groups")) || {};
    } catch {
      return {};
    }
  };

  const states = readStates();
  const items = Array.from(document.querySelectorAll(".nav-item"));
  const itemPath = new URLSearchParams(location.search).get("item");
  const activeItem =
    items.find((item) => item.dataset.path === itemPath) || items[0];

  for (const group of document.querySelectorAll(".nav-group")) {
    group.open = states[group.dataset.key] ?? true;
  }

  let group = activeItem?.closest(".nav-group");

  while (group) {
    group.open = true;
    group = group.parentElement.closest(".nav-group");
  }

  const isAnyOpen = Array.from(document.querySelectorAll(".nav-section")).some(
    (section) => section.open,
  );

  document.querySelector(".nav-fold-toggle").dataset.state = isAnyOpen
    ? "expanded"
    : "collapsed";
})();
