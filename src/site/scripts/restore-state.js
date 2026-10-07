(() => {
  const { dataset } = document.body;
  const isMobile = matchMedia("(max-width: 768px)").matches;

  dataset.theme = localStorage.getItem("theme") || dataset.theme;
  dataset.sidebar =
    localStorage.getItem("sidebar") ||
    (isMobile ? "collapsed" : dataset.sidebar);
})();
