import { Gallery } from "./Gallery";
import { images } from "./data";

export function App() {
  return (
    <main className="snippet">
      <h1 className="visually-hidden">Gallery</h1>
      <Gallery images={images} />
    </main>
  );
}
