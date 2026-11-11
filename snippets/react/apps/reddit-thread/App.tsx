import { RedditThread } from "./RedditThread";
import { comments } from "./data";

export function App() {
  return (
    <main className="demo">
      <h1>Reddit thread</h1>
      <RedditThread comments={comments} />
    </main>
  );
}
