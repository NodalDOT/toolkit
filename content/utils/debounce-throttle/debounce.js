export function debounce(func, wait) {
  let timer;
  return function (...arg) {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, arg);
    }, wait);
  };
}
