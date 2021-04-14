export function isIntersectionObserverAvailable() {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window
}

export function intersectionObserverCallback(
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) {
  const actionEntries = entries.filter((entry) => entry.isIntersecting)

  if (actionEntries.length > 0) {
    typeof window !== 'undefined' &&
      window.googletag.cmd.push(() => {
        const displayEntries = actionEntries.map((entry) => ({
          slot:
            typeof window !== 'undefined' &&
            window.googletag
              .pubads()
              .getSlots()
              .find(
                (element) => element.getSlotElementId() === entry.target.id
              ),
          target: entry.target
        }))

        displayEntries.forEach((element) => {
          if (
            typeof window !== 'undefined' &&
            window.googletag &&
            element.slot
          ) {
            window.googletag.display(element.slot.getSlotElementId())
            window.googletag
              .pubads()
              .refresh([element.slot], { changeCorrelator: false })
          }
        })
      })

    actionEntries.forEach((element) => {
      observer.unobserve(element.target)
    })
  }
}

export function intersectionObserverOptions(
  isMobile?: boolean,
  offset?: number
): IntersectionObserverInit | undefined {
  const DEFAULT_DESKTOP_OFFSET = 0.4
  const DEFAULT_MOBILE_OFFSET = 0.7

  const defaultDeviceOffset = isMobile
    ? DEFAULT_MOBILE_OFFSET
    : DEFAULT_DESKTOP_OFFSET

  const lazyLoadOffset =
    typeof offset !== 'undefined' ? offset : defaultDeviceOffset

  const rootMargin =
    typeof window !== 'undefined'
      ? Math.round(window.innerHeight * lazyLoadOffset)
      : 0

  return {
    rootMargin: `${rootMargin}px 0px`
  }
}
