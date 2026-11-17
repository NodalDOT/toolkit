import { ToastProvider } from "./ToastProvider";
import { ToastButton } from "./ToastButton";

export function App() {
  return (
    <main>
      <ToastProvider target="#target-id">
        <div>
          <ToastButton />
        </div>
        <div id="target-id" className="toast-container"></div>
      </ToastProvider>
    </main>
  );
}
