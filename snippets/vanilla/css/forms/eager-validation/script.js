const form = document.querySelector(".validation-form");
const fields = [...form.querySelectorAll(".validation-field input")];
const announcement = form.querySelector(".validation-announcement");
const result = form.querySelector(".validation-result");

const isValid = (field) => field.validity.valid && field.value.trim() !== "";

const showFeedback = (field, state, message) => {
  const feedback = document.getElementById(`${field.id}-feedback`);
  const invalid = state === "error";
  const descriptions = (field.getAttribute("aria-describedby") || "")
    .split(/\s+/)
    .filter((id) => id && id !== feedback.id);

  field.setAttribute("aria-invalid", String(invalid));
  if (invalid) {
    descriptions.push(feedback.id);
  }
  if (descriptions.length) {
    field.setAttribute("aria-describedby", descriptions.join(" "));
  } else {
    field.removeAttribute("aria-describedby");
  }

  feedback.dataset.state = state;
  feedback.textContent = message;
};

const validate = (field) => {
  if (isValid(field)) {
    showFeedback(field, "valid", `✓ ${field.dataset.success}`);
    return "";
  }

  const message =
    field.validity.valueMissing || !field.value.trim()
      ? field.dataset.missing
      : field.dataset.format;

  showFeedback(field, "error", `Error: ${message}`);
  return message;
};

for (const field of fields) {
  field.addEventListener("blur", () => {
    const message = validate(field);
    announcement.textContent = message
      ? `${field.labels[0].textContent}: ${message}`
      : "";
  });

  field.addEventListener("input", () => {
    result.textContent = "";
    announcement.textContent = "";

    if (field.getAttribute("aria-invalid") === "true") {
      validate(field);
    } else if (!isValid(field)) {
      showFeedback(field, "", "");
    }
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const invalidFields = fields.filter((field) => validate(field));
  const [firstInvalid] = invalidFields;

  if (firstInvalid) {
    result.textContent = "";
    firstInvalid.focus();
    return;
  }

  result.textContent = "Both fields are valid.";
});

form.noValidate = true;
