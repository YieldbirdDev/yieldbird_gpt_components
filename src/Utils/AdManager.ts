import { ensureScripts } from './headerScripts'

import { isIntersectionObserverAvailable } from './intersectionObserver'

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
            const slot = this.createSlot(adUnitPath, size, optDiv)

            this.setTargeting(slot, targeting)
            this.setSizeMapping(slot, sizeMapping)

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

  public static destroySlot(optDiv: string) {
    if (typeof window !== 'undefined') {
      window.googletag.cmd.push(() => {
        const slot = window.googletag
          .pubads()
          .getSlots()
          .find((el) => el.getSlotElementId() === optDiv)

        slot && window.googletag.destroySlots([slot])
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

  private static createSlot(
    adUnitPath: string,
    size: googletag.GeneralSize,
    optDiv: string
  ) {
    let slot = window.googletag
      .pubads()
      .getSlots()
      .find((el) => el.getSlotElementId() === optDiv)

    slot =
      slot ||
      window.googletag
        .defineSlot(adUnitPath, size, optDiv)
        .addService(window.googletag.pubads())

    slot.clearTargeting()

    return slot
  }

  private static setTargeting(
    slot: googletag.Slot,
    targeting?: { [key: string]: googletag.NamedSize }
  ) {
    if (slot && targeting) {
      Object.keys(targeting).forEach((targetingKey: string) => {
        slot.setTargeting(targetingKey, targeting[targetingKey])
      })
    }
  }

  private static setSizeMapping(
    slot: googletag.Slot,
    sizeMapping?: [googletag.SingleSizeArray, googletag.GeneralSize][]
  ) {
    if (sizeMapping) {
      const sizeMappingBuilder = window.googletag.sizeMapping()

      sizeMapping.forEach((sizeMap) => {
        sizeMappingBuilder.addSize(sizeMap[0], sizeMap[1])
      })

      slot.defineSizeMapping(sizeMappingBuilder.build())
    }
  }
}
