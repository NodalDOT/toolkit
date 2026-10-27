import type { ReactNode, Ref } from "react";

export interface TabItem<T extends string> {
  name: T;
  content: ReactNode;
}

export interface TabsProps<T extends string> {
  tabs: readonly TabItem<T>[];
  defaultTab?: NoInfer<T>;
  label: string;
}

export interface TabButtonProps {
  name: string;
  isActive: boolean;
  id: string;
  panelId: string;
  ref?: Ref<HTMLButtonElement>;
  onSelect: () => void;
}

export type Direction = "left" | "last" | "right" | "first";
