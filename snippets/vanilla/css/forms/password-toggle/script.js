const password = document.querySelector("#password");
const toggle = document.querySelector(".password-control button");

toggle.addEventListener("click", () => {
  const show = password.type === "password";

  password.type = show ? "text" : "password";
  toggle.textContent = show ? "Hide password" : "Show password";
});

toggle.hidden = false;
