export function throttle(func, wait) {
  let todo = true;

  return function (...arg) {
    if (todo) {
      let context = this;

      func.apply(context, arg);

      todo = false;

      setTimeout(() => {
        todo = true;
      }, wait);
    }
  };
}
