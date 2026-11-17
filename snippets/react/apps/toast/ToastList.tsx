import {
  useState,
  type Ref,
  type AnimationEventHandler,
  useImperativeHandle,
} from "react";
import type { ToastItem, ToastMethod } from "./types";

export const ToastList = ({ ref }: { ref: Ref<ToastMethod> }) => {
  const [toasts, setToasts] = useState<Array<ToastItem & { removed: boolean }>>(
    [],
  );
  useImperativeHandle(ref, () => {
    return {
      toast: (item: ToastItem) => {
        setToasts((current) => [...current, { ...item, removed: false }]);
      },
    };
  });

  const onAnimationEnd: AnimationEventHandler<HTMLUListElement> = ({
    target,
  }) => {
    if (!(target instanceof HTMLElement) || !target.dataset.id) return;
    const id = Number(target.dataset.id);

    if (target.dataset.removed === "true") {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    } else if (target.dataset.removed === "false") {
      setTimeout(() => {
        setToasts((current) =>
          current.map((toast) => ({
            ...toast,
            removed: toast.id === id ? true : toast.removed,
          })),
        );
      }, 3000);
    }
  };

  return (
    <ul
      data-test-example="react"
      className="toast-list"
      aria-live="polite"
      aria-relevant="additions removals"
      onAnimationEndCapture={onAnimationEnd}
    >
      {toasts.map((toast) => (
        <li
          key={toast.id}
          className={toast.removed ? "toast toast--removed" : "toast"}
          data-id={toast.id}
          data-removed={toast.removed}
          role="status"
          aria-atomic="true"
          aria-live="polite"
        >
          <div className="toast__content">
            <p>{toast.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};
