(() => {
  const { body } = document;
  const defaultTheme = body.dataset.theme;
  const showcaseBody = window.frameElement?.ownerDocument.body;

  const getShowcaseTheme = () => showcaseBody?.dataset.theme;
  const getSavedTheme = () => localStorage.getItem("theme");

  const syncTheme = () => {
    body.dataset.theme = getShowcaseTheme() || getSavedTheme() || defaultTheme;
  };

  syncTheme();

  if (showcaseBody) {
    new MutationObserver(syncTheme).observe(showcaseBody, {
      attributeFilter: ["data-theme"],
    });
  }
})();
