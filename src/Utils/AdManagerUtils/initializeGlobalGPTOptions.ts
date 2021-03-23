export function initiaizeGlobalGPTOptions(
  collapseEmptyDivs?: boolean,
  globalTargeting?: Record<string, string>,
  onImpressionViewable?: (
    event: googletag.events.ImpressionViewableEvent
  ) => void,
  onSlotOnload?: (event: googletag.events.SlotOnloadEvent) => void,
  onSlotRender?: (event: googletag.events.SlotRenderEndedEvent) => void,
  onSlotRequested?: (event: googletag.events.SlotRequestedEvent) => void,
  onSlotResponseReceived?: (
    event: googletag.events.SlotResponseReceived
  ) => void,
  onSlotVisibilityChanged?: (
    event: googletag.events.SlotVisibilityChangedEvent
  ) => void
): void {
  if (typeof window !== 'undefined') {
    window.googletag.cmd.push(() => {
      collapseEmptyDivs && window.googletag.pubads().collapseEmptyDivs()

      if (globalTargeting && Object.keys(globalTargeting).length) {
        Object.keys(globalTargeting).forEach((key) => {
          window.googletag.pubads().setTargeting(key, globalTargeting[key])
        })
      }

      if (onImpressionViewable) {
        window.googletag
          .pubads()
          .addEventListener('impressionViewable', onImpressionViewable)
      }

      if (onSlotOnload) {
        window.googletag.pubads().addEventListener('slotOnload', onSlotOnload)
      }

      if (onSlotRender) {
        window.googletag
          .pubads()
          .addEventListener('slotRenderEnded', onSlotRender)
      }

      if (onSlotRequested) {
        window.googletag
          .pubads()
          .addEventListener('slotRequested', onSlotRequested)
      }

      if (onSlotResponseReceived) {
        window.googletag
          .pubads()
          .addEventListener('slotResponseReceived', onSlotResponseReceived)
      }

      if (onSlotVisibilityChanged) {
        window.googletag
          .pubads()
          .addEventListener('slotVisibilityChanged', onSlotVisibilityChanged)
      }
    })
  }
}
