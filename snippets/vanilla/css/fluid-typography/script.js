const control = document.querySelector(".width-control");
const slider = control.querySelector("input");
const output = control.querySelector("output");
const container = document.querySelector(".type-container");
const heading = container.querySelector("h2");

const updateOutput = () => {
  const width = Math.round(container.getBoundingClientRect().width);
  const fontSize = Number.parseFloat(getComputedStyle(heading).fontSize);
  output.value = `${width} px container · ${fontSize.toFixed(1)} px type`;
};

const updateWidth = () => {
  container.style.setProperty("--demo-width", `${slider.value}px`);
  updateOutput();
};

slider.addEventListener("input", updateWidth);
const observer = new ResizeObserver(updateOutput);
observer.observe(container);

updateWidth();
control.hidden = false;
