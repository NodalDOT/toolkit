document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("preview");
  const buttons = document.querySelectorAll(".nav-item");

  const getComponentPath = (button) => {
    const { component, element } = button.dataset;

    return `./${component}/${element}/index.html`;
  };

  for (const button of buttons) {
    button.addEventListener("click", () => {
      iframe.src = getComponentPath(button);
    });
  }
});
