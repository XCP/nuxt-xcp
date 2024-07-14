export function debounce(fn, delay) {
  let timeoutID
  return function (...args) {
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
