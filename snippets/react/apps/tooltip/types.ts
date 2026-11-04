import type { ReactNode } from "react";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export type Direction = "left" | "right" | "bottom" | "top";

export type Placement = Record<
  Direction,
  { fits: boolean; x: number; y: number }
>;
export type Coords = {
  x: number;
  y: number;
};
