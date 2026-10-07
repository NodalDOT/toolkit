const namedCheck = document.querySelector("#named");
const animatedCheck = document.querySelector("#animated");
const details = document.querySelectorAll("details");

const toggleNamedCheck = () => {
  const isFirstDetailNamed = details[0].matches("[name]")
  if (isFirstDetailNamed) {
    details.forEach((d) => d.removeAttribute("name"));
  } else {
    details.forEach((d) => d.setAttribute("name", "accordion"));
  }
};
const toggleAnimatedCheck = () => {
  details.forEach((detail) => {
    detail.classList.toggle("animate");
  })
};
namedCheck.addEventListener("change", toggleNamedCheck);
animatedCheck.addEventListener("change", toggleAnimatedCheck);
