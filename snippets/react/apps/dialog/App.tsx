import { useEffect, useId, useRef, useState } from "react";
import type { DialogProps } from "./types.ts";

const Dialog = ({
  open,
  title,
  onConfirm,
  onCancel,
  children,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    else dialog.close();
  }, [open]);

  const handleClose = () => {
    if (open) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={titleId}
      onClose={handleClose}
    >
      <h2 id={titleId} className="dialog-title">
        {title}
      </h2>
      <div className="dialog-body">{children}</div>
      <footer className="dialog-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm}>
          Confirm
        </button>
      </footer>
    </dialog>
  );
};

export function App() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");

  const finish = (message: string) => {
    setOpen(false);
    setResult(message);
  };

  return (
    <main>
      <button type="button" onClick={() => setOpen(true)}>
        Delete file
      </button>
      <p role="status">{result}</p>

      <Dialog
        open={open}
        title="Delete file?"
        onConfirm={() => finish("File deleted")}
        onCancel={() => finish("Cancelled")}
      >
        <p>This action cannot be undone.</p>
      </Dialog>
    </main>
  );
}
