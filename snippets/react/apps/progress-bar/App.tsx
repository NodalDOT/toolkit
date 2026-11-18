import { useEffect, useState } from "react";

import { ProgressBar } from "./ProgressBar";

export function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 11) + 5;
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [progress]);

  const handleReset = () => setProgress(0);

  return (
    <main className="snippet">
      <ProgressBar label={`${progress}%`} value={progress} />

      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </main>
  );
}
