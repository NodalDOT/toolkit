const check = document.querySelector("[type=checkbox]");
const details = document.querySelectorAll("details");

const toggle = () => {
  if (details[0].matches("[name]")) {
    details.forEach((d) => d.removeAttribute("name"));
  } else {
    details.forEach((d) => d.setAttribute("name", "accordion"));
  }
};

check.addEventListener("change", toggle);
