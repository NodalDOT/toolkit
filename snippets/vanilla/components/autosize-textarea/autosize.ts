export function autosize(textarea: HTMLTextAreaElement) {
  const resize = () => {
    const border = textarea.offsetHeight - textarea.clientHeight;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + border}px`;
  };

  textarea.addEventListener("input", resize);
  resize();

  return () => {
    textarea.removeEventListener("input", resize);
    textarea.style.height = "";
  };
}
