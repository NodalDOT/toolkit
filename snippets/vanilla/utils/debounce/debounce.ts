export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function debounced(this: unknown, ...args: Args) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
