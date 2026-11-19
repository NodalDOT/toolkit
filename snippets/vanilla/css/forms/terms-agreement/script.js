const form = document.querySelector(".agreement-form");
const agreement = form.querySelector("input");
const submit = form.querySelector("button");
const result = form.querySelector(".agreement-result");

const updateAgreement = () => {
  submit.disabled = !agreement.checked;
  result.textContent = "";
};

agreement.addEventListener("change", updateAgreement);
window.addEventListener("pageshow", updateAgreement);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  result.textContent = "Demo terms accepted.";
});

updateAgreement();
