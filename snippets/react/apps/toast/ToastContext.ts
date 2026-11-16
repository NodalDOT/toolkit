import { createContext, useContext } from "react";
import type { ToastMethod } from "./types";

export const ToastContext = createContext<ToastMethod | null>(null)


export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast need ToastProvider')
  return context
}
