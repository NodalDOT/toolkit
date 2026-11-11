import { useState, type CSSProperties, type KeyboardEvent } from "react";
type TGalleryProps = {
  images: string[];
};

export function Gallery({ images }: TGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const index = Math.min(currentIndex, Math.max(0, images.length - 1));

  const prev = () => setCurrentIndex(Math.max(0, index - 1));
  const next = () => setCurrentIndex(Math.min(images.length - 1, index + 1));

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  };

  if (images.length === 0) return <p>No images found</p>;

  return (
    <section
      className="gallery"
      aria-label="Photo gallery"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="gallery__viewport">
        <ul
          className="gallery__list"
          style={{ "--index": index } as CSSProperties}
        >
          {images.map((image, imageIndex) => (
            <li
              className="gallery__slide"
              key={`${image}-${imageIndex}`}
              aria-hidden={imageIndex !== index}
            >
              <img
                className="gallery__image"
                src={image}
                alt={`Landscape ${imageIndex + 1}`}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="gallery__controls">
        <button
          className="gallery__button"
          type="button"
          disabled={index === 0}
          onClick={prev}
          aria-label="Previous image"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m12 5-7 7 7 7M5 12h14" />
          </svg>
        </button>
        <span aria-live="polite" aria-atomic="true">
          {index + 1} / {images.length}
        </span>
        <button
          className="gallery__button"
          type="button"
          disabled={index === images.length - 1}
          onClick={next}
          aria-label="Next image"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m12 5 7 7-7 7M19 12H5" />
          </svg>
        </button>
      </div>
    </section>
  );
}
