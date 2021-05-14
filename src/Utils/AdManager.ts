import { ensureScripts } from './headerScripts'

import { initiaizeGlobalGPTOptions } from './AdManagerUtils'

export class AdManager {
  private adsToRefresh: {
    [key: string]: googletag.Slot
  }

  private adsToRetarget: {
    [key: string]: googletag.Slot
  }

  private optOptions: optOptions

  private refreshInterval: number | null

  private refreshTimeout: number

  private retargetInterval: number | null

  private retargetTimeout: number

  constructor(timeout = 400, optOptions: optOptions) {
    this.adsToRefresh = {}
    this.adsToRetarget = {}
    this.optOptions = optOptions
    this.refreshInterval = null
    this.refreshTimeout = timeout
    this.retargetInterval = null
    this.retargetTimeout = timeout

    ensureScripts()
  }

  public initiaizeGlobalGPTOptions(
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
    initiaizeGlobalGPTOptions(
      collapseEmptyDivs,
      globalTargeting,
      onImpressionViewable,
      onSlotOnload,
      onSlotRender,
      onSlotRequested,
      onSlotResponseReceived,
      onSlotVisibilityChanged
    )
  }

  public refreshSlot(slot: googletag.Slot, optDiv: string) {
    if (typeof window !== 'undefined') {
      this.adsToRefresh[optDiv] = slot

      this.refreshInterval && window.clearInterval(this.refreshInterval)
      this.refreshInterval = window.setTimeout(
        () => {
          const slots = Object.keys(this.adsToRefresh).map(
            (el) => this.adsToRefresh[el]
          )

          if (slots.length > 0) {
            window.Yieldbird.cmd.push(() => {
              window.Yieldbird.refresh(slots, this.optOptions)
              this.adsToRefresh = {}
            })
          }
        },
        this.refreshTimeout,
        true
      )
    }
  }

  public retargetSlot(
    slot: googletag.Slot,
    optDiv: string,
    intersectionObserver: IntersectionObserver
  ): Promise<string[]> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        this.adsToRetarget[optDiv] = slot

        this.retargetInterval && window.clearInterval(this.retargetInterval)
        this.retargetInterval = window.setTimeout(
          () => {
            const slots = Object.keys(this.adsToRetarget).map(
              (el) => this.adsToRetarget[el]
            )

            if (slots.length > 0) {
              window.Yieldbird.cmd.push(() => {
                const optDivs = Object.keys(this.adsToRetarget)

                window.Yieldbird.retarget(slots)
                this.adsToRetarget = {}
                resolve(optDivs)
              })
            } else {
              resolve([])
            }

            slots.forEach((googletagSlot) => {
              const element = document.getElementById(
                googletagSlot.getSlotElementId()
              )

              element &&
                intersectionObserver &&
                intersectionObserver.observe(element)
            })
          },
          this.retargetTimeout,
          true
        )
      } else {
        resolve([])
      }
    })
  }
}
