export function isIntersectionObserverAvailable() {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window
}
