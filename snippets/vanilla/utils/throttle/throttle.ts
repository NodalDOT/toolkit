export function throttle<Args extends unknown[]>(func: (...args:Args)=> void, wait:number){
  let lastCall = 0
  let timer: ReturnType<typeof setTimeout>  | null  = null
  return function throttled(this: unknown, ...args:Args) {
    const remaining = wait - (performance.now() - lastCall)
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (remaining <= 0) {
      lastCall = performance.now()
      func.apply(this, args)

    } else {
      timer = setTimeout(() => {
        lastCall = performance.now()
        timer = null
        func.apply(this, args)

      }, remaining)
    }
  }
}
