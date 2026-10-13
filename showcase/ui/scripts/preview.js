const preview = document.querySelector(".preview");
const iframe = preview.querySelector("iframe");

const setLoading = (isLoading) => {
  preview.toggleAttribute("data-loading", isLoading);
};

export const loadPreview = (url) => {
  setLoading(true);
  iframe.src = url;
};

export const initPreview = () => {
  iframe.addEventListener("load", () => {
    setLoading(false);
  });
};
