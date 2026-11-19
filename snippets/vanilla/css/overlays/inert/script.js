const toggle = document.querySelector(".inert-toggle");
const checkbox = toggle.querySelector("input");
const editor = document.querySelector(".note-editor");
const note = document.querySelector("#note");
const preview = document.querySelector("#preview-note");
const status = document.querySelector(".note-status");

const updateEditor = () => {
  editor.inert = checkbox.checked;
  status.textContent = editor.inert ? "Editor frozen." : "Editor unlocked.";
};

checkbox.addEventListener("change", updateEditor);
preview.addEventListener("click", () => {
  status.textContent = note.value.trim() || "The note is empty.";
});

if ("inert" in editor) {
  editor.inert = checkbox.checked;
  toggle.hidden = false;
}

preview.disabled = false;
