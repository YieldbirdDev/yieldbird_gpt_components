export function isIntersectionObserverAvailable() {
  return window && 'IntersectionObserver' in window
}
