const control = document.querySelector(".width-control");
const slider = control.querySelector("input");
const output = control.querySelector("output");
const column = document.querySelector(".primary");

const updateWidth = () => {
  const width = `${slider.value}rem`;
  column.style.setProperty("--column-width", width);
  output.value = width;
  slider.setAttribute("aria-valuetext", `${slider.value} rem`);
};

slider.addEventListener("input", updateWidth);
updateWidth();
control.hidden = false;
