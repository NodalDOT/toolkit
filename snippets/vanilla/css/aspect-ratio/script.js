import imageUrl from "./landscape-1.jpg";

const button = document.querySelector("#load-image");
const status = document.querySelector("#load-status");
const slots = document.querySelectorAll(".media");

button.addEventListener("click", async () => {
  button.disabled = true;
  status.textContent = "Loading image…";

  for (const slot of slots) {
    slot.replaceChildren();
  }

  const image = new Image();
  image.alt = "Landscape";
  image.src = imageUrl;

  try {
    await Promise.all([
      image.decode(),
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);

    for (const slot of slots) {
      slot.append(image.cloneNode());
    }

    status.textContent = "Image loaded.";
    button.textContent = "Replay";
  } catch {
    status.textContent = "Could not load the image. Try again.";
  } finally {
    button.disabled = false;
  }
});

button.disabled = false;
