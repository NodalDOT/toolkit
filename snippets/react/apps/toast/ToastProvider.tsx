import { useMemo, useState, useRef, type PropsWithChildren, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ToastContext } from "./ToastContext";
import { ToastList } from "./ToastList";
import type { ToastMethod } from "./types";

export const ToastProvider = ({ children, target }: PropsWithChildren<{ target: string }>) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const toastRef = useRef<ToastMethod>(null)
  useLayoutEffect(() => {
    if (targetElement == null && target != null) {
      const element = document.querySelector(target)
      if (element instanceof HTMLElement) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTargetElement(element)
      }
    }
  }, [target, targetElement])
  const context = useMemo<ToastMethod>(() => {
    return {
      toast: (item) => {
        if(toastRef.current) toastRef.current.toast(item)
      }
    }
  }, [])
  return <ToastContext.Provider value={context}>
    {targetElement && createPortal(<ToastList ref={ toastRef } />, targetElement) }
    {children}
  </ToastContext.Provider>
}
