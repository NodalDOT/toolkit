import {
  useEffect,
  useId,
  useState,
  useRef,
  useLayoutEffect,
  type CSSProperties,
} from "react";
import type { TooltipProps, Placement, Coords } from "./types.ts";
import { extractCoords } from "./utils.ts";

// TODO:
// 1. Refactor return value handling.
// 2. Support custom boundary containers instead of relying solely on window.
// 3. Add customizable styling.

const GAP = 8;
const PADDING = 8;

const Tooltip = (props: TooltipProps) => {
  const { children, content } = props;
  const [visible, setVisible] = useState(true);
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

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [isOpen]);

  useLayoutEffect(() => {

    const updatePosition = () => {
      if (!isOpen || !targetRef.current || !contentRef.current) return;

      const windowContainer = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const target = extractCoords(targetRef.current?.getBoundingClientRect());
      const content = extractCoords(contentRef.current?.getBoundingClientRect());

      const placements: Placement = {
        top: {
          fits: target.top >= content.height + GAP+ PADDING,
          x: target.left + (target.width - content.width) / 2,
          y: target.top - content.height - GAP,
        },
        left: {
          fits: target.left >= content.width + GAP + PADDING,
          x: target.left - content.width - GAP,
          y: target.top + (target.height - content.height) / 2,
        },
        bottom: {
          fits:
            windowContainer.height - (target.top + target.height) >=
            content.height + GAP + PADDING,
          x: target.left + (target.width - content.width) / 2,
          y: target.top + target.height + GAP,
        },
        right: {
          fits:
            windowContainer.width - (target.left + target.width) >=
            content.width + GAP+ PADDING,
          x: target.left + target.width + GAP,
          y: target.top + (target.height - content.height) / 2,
        },
      };
      const placement = Object.entries(placements).find(([, placement]) => {
        return placement.fits;
      });
      if (!placement) {
          return
      }
      const [side, { x, y }] = placement;

      const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);

        let nextX = x;
        let nextY = y;

      if (side === "top" || side === "bottom") {
        nextX = clamp(
          x,
          PADDING,
          window.innerWidth - content.width - PADDING
        );
      }

      if (side === "left" || side === "right") {
        nextY = clamp(
          y,
          PADDING,
          window.innerHeight - content.height - PADDING
        );
      }

      setCoords({
        x: nextX,
        y: nextY,
      });

    }
    updatePosition()
    window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
  }, [isOpen]);

  return (
    <>
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
            className="tooltip__content"
            ref={contentRef}
            role="tooltip"
            style={
              {
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
    </>
  );
};

export function App() {
  return (
    <>
      <Tooltip content={<p>Test!!!!!!!!!!!!!!!!!!</p>}>
        <button>Test</button>
      </Tooltip>
    </>
  );
}
