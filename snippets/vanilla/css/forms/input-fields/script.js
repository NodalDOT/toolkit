const note = document.querySelector("#note");
const count = document.querySelector("#note-count");
const countAnnouncement = document.querySelector("#note-announcement");
const limit = Number(note.dataset.limit);
const segmenter = "Segmenter" in Intl ? new Intl.Segmenter() : null;
let countTimer;

const countCharacters = (text) => {
  const characters = segmenter ? segmenter.segment(text) : text;
  return Array.from(characters).length;
};

const updateCount = () => {
  const remaining = limit - countCharacters(note.value);
  const amount = Math.abs(remaining);
  const unit = amount === 1 ? "character" : "characters";
  const overLimit = remaining < 0;

  count.textContent = overLimit
    ? `${amount} ${unit} over the limit.`
    : `${amount} ${unit} remaining.`;
  count.dataset.state = overLimit ? "error" : remaining <= 20 ? "near" : "";
  note.setAttribute("aria-invalid", String(overLimit));
};

note.addEventListener("input", () => {
  updateCount();
  clearTimeout(countTimer);
  countTimer = setTimeout(() => {
    countAnnouncement.textContent = count.textContent;
  }, 600);
});

const password = document.querySelector("#new-password");
const passwordToggle = document.querySelector(".password-control button");
const rules = [...document.querySelectorAll(".password-rules li")];
const passwordProgress = document.querySelector("#password-progress");

const updatePassword = () => {
  const requirements = [
    countCharacters(password.value) >= 12,
    /\S/.test(password.value),
  ];

  rules.forEach((rule, index) => {
    rule.toggleAttribute("data-met", requirements[index]);
    rule.querySelector("span").textContent = requirements[index] ? "✓" : "○";
  });

  const passed = requirements.filter(Boolean).length;
  const message = `${passed} of ${rules.length} requirements met.`;
  if (passwordProgress.textContent !== message) {
    passwordProgress.textContent = message;
  }
};

passwordToggle.addEventListener("click", () => {
  const show = password.type === "password";
  password.type = show ? "text" : "password";
  passwordToggle.textContent = show ? "Hide password" : "Show password";
});
passwordToggle.hidden = false;
password.addEventListener("input", updatePassword);

const birthDate = document.querySelector(".birth-date");
const day = document.querySelector("#birth-day");
const month = document.querySelector("#birth-month");
const year = document.querySelector("#birth-year");
const dateResult = document.querySelector("#date-result");
const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
  calendar: "gregory",
  timeZone: "UTC",
});
const dateInputs = { day, month, year };
const dateOrder = dateFormat
  .formatToParts(new Date(2000, 5, 15))
  .filter(({ type }) => Object.hasOwn(dateInputs, type))
  .map(({ type }) => dateInputs[type]);

birthDate.append(...dateOrder.map((field) => field.closest("label")));
document.querySelector("#date-hint").textContent =
  `Enter ${dateOrder.map((field) => field.id.replace("birth-", "")).join(", ")} in that order.`;

const updateDate = () => {
  if (!day.value || !month.value || year.value.length < 4) {
    dateResult.textContent = "";
    return;
  }

  const parts = [year.value, month.value, day.value];
  const values = parts.map(Number);
  const [yearNumber, monthNumber, dayNumber] = values;
  const date = new Date(0);
  date.setUTCFullYear(yearNumber, monthNumber - 1, dayNumber);
  const valid =
    parts.every((part) => /^\d+$/.test(part)) &&
    yearNumber > 0 &&
    date.getUTCFullYear() === yearNumber &&
    date.getUTCMonth() === monthNumber - 1 &&
    date.getUTCDate() === dayNumber;

  dateResult.dataset.state = valid ? "" : "error";
  dateResult.textContent = valid
    ? dateFormat.format(date)
    : "Enter a valid calendar date.";
};

dateOrder.forEach((field, index) => {
  field.addEventListener("input", (event) => {
    updateDate();

    const max = field === day ? 31 : field === month ? 12 : 9999;
    const value = Number(field.value);
    if (
      event.inputType === "insertText" &&
      !event.isComposing &&
      /^\d+$/.test(field.value) &&
      value > 0 &&
      value <= max &&
      field.value.length === field.maxLength &&
      field.selectionStart === field.value.length
    ) {
      dateOrder[index + 1]?.focus();
    }
  });
});

const countryCode = document.querySelector("#country-code");
const phone = document.querySelector("#phone");

if (new Intl.Locale(navigator.language).region === "FR") {
  countryCode.value = "+33";
}

const updatePhoneExample = () => {
  phone.placeholder =
    countryCode.value === "+33" ? "06 12 34 56 78" : "202 555 0148";
};

countryCode.addEventListener("change", updatePhoneExample);
phone.addEventListener("blur", () => {
  const value = phone.value.trim();
  if (!/^\+?[\d\s().-]+$/.test(value)) return;

  let digits = value.replace(/\D/g, "");
  if (value.startsWith("+")) {
    const prefix = countryCode.value.slice(1);
    if (!digits.startsWith(prefix)) return;
    digits = digits.slice(prefix.length);
  }

  if (countryCode.value === "+33") {
    const national = digits.replace(/^0/, "");
    if (/^[1-9]\d{8}$/.test(national)) {
      phone.value = `0${national}`.match(/\d{2}/g).join(" ");
    }
  } else if (/^\d{10}$/.test(digits)) {
    phone.value = digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
  }
});

updateCount();
updatePassword();
updateDate();
updatePhoneExample();
