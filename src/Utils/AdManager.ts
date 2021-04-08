import { ensureScripts } from './headerScripts'

import { isIntersectionObserverAvailable } from './intersectionObserver'
import {
  createSlot,
  initiaizeGlobalGPTOptions,
  setTargeting,
  setSizeMapping
} from './AdManagerUtils'

export class AdManager {
  private adsToRefresh: {
    [key: string]: googletag.Slot
  }

  private adsToRetarget: {
    [key: string]: googletag.Slot
  }

  private refreshInterval: number | null

  private refreshTimeout: number

  private retargetInterval: number | null

  private retargetTimeout: number

  constructor(timeout = 1000) {
    this.adsToRefresh = {}
    this.adsToRetarget = {}
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

  public static defineSlot(
    adUnitPath: string,
    size: googletag.GeneralSize,
    optDiv: string,
    shouldRefreshAds: boolean,
    sizeMapping?: [googletag.SingleSizeArray, googletag.GeneralSize][],
    targeting?: { [key: string]: googletag.NamedSize },
    lazyLoad?: boolean
  ): Promise<googletag.Slot> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined') {
        window.Yieldbird.cmd.push(() => {
          window.googletag.cmd.push(() => {
            const slot = createSlot(adUnitPath, size, optDiv)

            setTargeting(slot, targeting)
            setSizeMapping(slot, sizeMapping)

            !shouldRefreshAds && window.Yieldbird.setGPTTargeting([slot])
            window.googletag.enableServices()

            if (!lazyLoad || !isIntersectionObserverAvailable()) {
              window.googletag.display(optDiv)

              !shouldRefreshAds && window.googletag.pubads().refresh([slot])
            }

            slot
              ? resolve(slot)
              : reject(new Error('Slot could not be created.'))
          })
        })
      } else {
        reject(new Error('Slot could not be created.'))
      }
    })
  }

  public static destroySlot(optDiv: string, screeningAd?: boolean) {
    if (typeof window !== 'undefined') {
      window.googletag.cmd.push(() => {
        const slot = window.googletag
          .pubads()
          .getSlots()
          .find((el) => el.getSlotElementId() === optDiv)

        slot && window.googletag.destroySlots([slot])

        if (screeningAd) {
          document.body.style.backgroundColor = ''
          document.body.style.backgroundImage = ''
          document.body.style.backgroundRepeat = ''
          document.body.style.backgroundPosition = ''
          document.body.style.backgroundAttachment = ''
          document.body.style.backgroundSize = ''
          document.body.style.cursor = ''
        }
      })
    }
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
              window.Yieldbird.refresh(slots)
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
