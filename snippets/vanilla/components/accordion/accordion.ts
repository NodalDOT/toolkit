const DURATION = 300;
const EASING = "ease";

export function accordion(items: HTMLDetailsElement[]) {
  const animations = new Map<HTMLDetailsElement, Animation>();
  const names = new Map<HTMLDetailsElement, string>();
  const expanded = new Map<HTMLDetailsElement, boolean>();

  const restoreName = (detail: HTMLDetailsElement) => {
    const name = names.get(detail);
    if (name === undefined) return;
    detail.setAttribute("name", name);
    names.delete(detail);
  };

  const animate = (detail: HTMLDetailsElement, open: boolean) => {
    const summary = detail.querySelector("summary")!;
    const from = detail.offsetHeight;

    animations.get(detail)?.cancel();
    expanded.set(detail, open);

    if (open) {
      restoreName(detail);
      delete detail.dataset.closing;
      detail.open = true;
    } else {
      const name = detail.getAttribute("name");
      if (name !== null) {
        names.set(detail, name);
        detail.removeAttribute("name");
      }
      detail.dataset.closing = "";
    }

    const to = open ? detail.offsetHeight : summary.offsetHeight;
    const animation = detail.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: DURATION, easing: EASING },
    );
    animations.set(detail, animation);

    animation.onfinish = () => settle(detail);
  };

  const settle = (detail: HTMLDetailsElement) => {
    animations.get(detail)?.cancel();
    animations.delete(detail);
    if (expanded.get(detail) !== false) return;
    detail.open = false;
    delete detail.dataset.closing;
    restoreName(detail);
  };

  const onClick = (event: MouseEvent) => {
    const summary = event.currentTarget as HTMLElement;
    const detail = summary.parentElement as HTMLDetailsElement;
    event.preventDefault();

    const open = !(expanded.get(detail) ?? detail.open);

    if (open) {
      const name = detail.getAttribute("name") ?? names.get(detail);
      if (name) {
        items
          .filter(
            (other) =>
              other !== detail &&
              other.getAttribute("name") === name &&
              (expanded.get(other) ?? other.open),
          )
          .forEach((other) => animate(other, false));
      }
    }

    animate(detail, open);
  };

  items.forEach((detail) =>
    detail.querySelector("summary")!.addEventListener("click", onClick),
  );

  return () => {
    items.forEach((detail) => {
      detail.querySelector("summary")!.removeEventListener("click", onClick);
      settle(detail);
    });
    expanded.clear();
  };
}
