import type { ReactNode } from "react";

export interface DialogProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  children: ReactNode;
}
