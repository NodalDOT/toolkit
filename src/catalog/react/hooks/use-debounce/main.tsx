import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { useDebounce } from "./useDebounce";
import "./style.css";

const DELAY_MS = 500;

function Demo() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, DELAY_MS);
  const [requests, setRequests] = useState<string[]>([]);

  const [loggedQuery, setLoggedQuery] = useState(debouncedQuery);

  if (debouncedQuery !== loggedQuery) {
    setLoggedQuery(debouncedQuery);

    if (debouncedQuery) {
      setRequests((prev) => [debouncedQuery, ...prev].slice(0, 8));
    }
  }

  return (
    <main className="demo">
      <h1>useDebounce</h1>
      <p className="hint">
        The value settles {DELAY_MS}ms after you stop typing. Only settled
        values would hit the API.
      </p>

      <input
        autoFocus
        placeholder="Search…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <dl className="values">
        <dt>Current</dt>
        <dd>{query || "—"}</dd>
        <dt>Debounced</dt>
        <dd>{debouncedQuery || "—"}</dd>
      </dl>

      <h2>Requests sent</h2>
      <ol className="requests">
        {requests.map((request, index) => (
          <li key={`${request}-${requests.length - index}`}>{request}</li>
        ))}
      </ol>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
