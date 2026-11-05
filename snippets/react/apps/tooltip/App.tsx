import {
  useEffect,
  useId,
  useState,
  useRef,
  useLayoutEffect,
  type CSSProperties,
} from "react";
import type { TooltipProps, Placement, Coords, Direction } from "./types.ts";
import { extractCoords } from "./utils.ts";

const GAP = 8;
const PADDING = 8;

const Tooltip = (props: TooltipProps) => {
  const {
    children,
    content,
    boundaryRef,
    placement: preferred = "top",
    className = "",
    style,
  } = props;
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);

  const id = useId();
  const isOpen = visible && !dismissed;
  const targetRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const show = () => {
    setVisible(true);
    setDismissed(false);
  };
  const hide = () => {
    setVisible(false);
    setCoords(null);
  };
  useEffect(() => {
    if (!isOpen) return;

    const listener = ({ key }: KeyboardEvent) => {
      if (key === "Escape") {
        setDismissed(true);
        setCoords(null);
      }
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (!isOpen || !targetRef.current || !contentRef.current) return;

      const boundary = boundaryRef.current;
      if (!boundary) return;
      const rect = boundary.getBoundingClientRect();
      const container = {
        left: rect.left + boundary.clientLeft,
        top: rect.top + boundary.clientTop,
        width: boundary.clientWidth,
        height: boundary.clientHeight,
      };
      contentRef.current.style.maxWidth = `${Math.max(0, container.width - PADDING * 2)}px`;
      contentRef.current.style.maxHeight = `${Math.max(0, container.height - PADDING * 2)}px`;
      const target = extractCoords(targetRef.current.getBoundingClientRect());
      const content = extractCoords(contentRef.current.getBoundingClientRect());

      const placements: Placement = {
        top: {
          fits: target.top - container.top >= content.height + GAP + PADDING,
          x: target.left + (target.width - content.width) / 2,
          y: target.top - content.height - GAP,
        },
        left: {
          fits: target.left - container.left >= content.width + GAP + PADDING,
          x: target.left - content.width - GAP,
          y: target.top + (target.height - content.height) / 2,
        },
        bottom: {
          fits:
            container.top + container.height - (target.top + target.height) >=
            content.height + GAP + PADDING,
          x: target.left + (target.width - content.width) / 2,
          y: target.top + target.height + GAP,
        },
        right: {
          fits:
            container.left + container.width - (target.left + target.width) >=
            content.width + GAP + PADDING,
          x: target.left + target.width + GAP,
          y: target.top + (target.height - content.height) / 2,
        },
      };
      const sides: Direction[] = [
        preferred,
        ...(["top", "bottom", "left", "right"] as Direction[]).filter(
          (side) => side !== preferred,
        ),
      ];
      const side = sides.find((side) => placements[side].fits) ?? preferred;
      const { x, y } = placements[side];
      const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(value, Math.max(min, max)));
      const nextX = clamp(
        x,
        container.left + PADDING,
        container.left + container.width - content.width - PADDING,
      );
      const nextY = clamp(
        y,
        container.top + PADDING,
        container.top + container.height - content.height - PADDING,
      );

      setCoords({
        x: nextX,
        y: nextY,
      });
    };
    updatePosition();
    document.addEventListener("scroll", updatePosition, true);
    const observer = new ResizeObserver(updatePosition);
    if (boundaryRef.current) observer.observe(boundaryRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => {
      document.removeEventListener("scroll", updatePosition, true);
      observer.disconnect();
    };
  }, [isOpen, boundaryRef, preferred, content]);

  return (
    <div
      ref={targetRef}
      onMouseEnter={show}
      onFocus={show}
      onMouseLeave={hide}
      onBlur={hide}
      aria-describedby={isOpen ? id : undefined}
      className="tooltip"
    >
      {children}

      {isOpen && (
        <div
          className={`tooltip__content ${className}`}
          ref={contentRef}
          role="tooltip"
          style={
            {
              ...style,
              "--x": coords?.x,
              "--y": coords?.y,
              visibility: coords ? "visible" : "hidden",
            } as CSSProperties
          }
          id={id}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export function App() {
  const overflowRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  return (
    <main className="demo">
      <div className="boundary boundary--tight boundary--start" ref={rightRef}>
        <Tooltip boundaryRef={rightRef} placement="top" content="Right">
          <button>Hover</button>
        </Tooltip>
      </div>
      <div className="boundary boundary--tight" ref={leftRef}>
        <Tooltip boundaryRef={leftRef} placement="top" content="Left">
          <button>Hover</button>
        </Tooltip>
      </div>
      <div className="boundary" ref={overflowRef}>
        <Tooltip
          boundaryRef={overflowRef}
          placement="right"
          content="Long tooltip content wraps inside the container."
        >
          <button>Overflow</button>
        </Tooltip>
      </div>
    </main>
  );
}
