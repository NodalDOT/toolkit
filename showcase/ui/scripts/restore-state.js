(() => {
  const { dataset } = document.body;
  const isMobile = matchMedia("(max-width: 768px)").matches;

  dataset.theme =
    localStorage.getItem("{{ themeStorageKey }}") || dataset.theme;
  dataset.sidebar =
    localStorage.getItem("{{ sidebarStorageKey }}") ||
    (isMobile ? "collapsed" : dataset.sidebar);
})();
