import type { CSSProperties, ReactNode, RefObject } from "react";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  boundaryRef: RefObject<HTMLElement | null>;
  placement?: Direction;
  className?: string;
  style?: CSSProperties;
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
