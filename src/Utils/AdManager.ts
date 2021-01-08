import { ensureScripts } from './headerScripts'

export class AdManager {
  private adsToRefresh: {
    [key: string]: googletag.Slot
  }

  private interval: number | null

  private timeout: number

  constructor(timeout = 1000) {
    this.adsToRefresh = {}
    this.interval = null
    this.timeout = timeout

    ensureScripts()
  }

  public static defineSlot(
    adUnitPath: string,
    size: googletag.GeneralSize,
    optDiv: string,
    shouldRefreshAds: boolean,
    sizeMapping?: [googletag.SingleSizeArray, googletag.GeneralSize][],
    targeting?: { [key: string]: googletag.NamedSize }
  ): Promise<googletag.Slot> {
    return new Promise((resolve, reject) => {
      window.Yieldbird.cmd.push(() => {
        window.googletag.cmd.push(() => {
          const slot = this.createSlot(adUnitPath, size, optDiv)

          this.setTargeting(slot, targeting)
          this.setSizeMapping(slot, sizeMapping)

          if (!shouldRefreshAds) {
            window.Yieldbird.setGPTTargeting([slot])
            window.googletag.enableServices()
            window.googletag.display(optDiv)
            window.googletag.pubads().refresh([slot])
          } else {
            window.googletag.enableServices()
            window.googletag.display(optDiv)
          }

          slot ? resolve(slot) : reject(new Error('Slot could not be created.'))
        })
      })
    })
  }

  public static destroySlot(optDiv: string) {
    window.googletag.cmd.push(() => {
      const slot = window.googletag
        .pubads()
        .getSlots()
        .find((el) => el.getSlotElementId() === optDiv)

      slot && window.googletag.destroySlots([slot])
    })
  }

  public refreshSlot(slot: googletag.Slot, optDiv: string) {
    this.adsToRefresh[optDiv] = slot

    this.interval && window.clearInterval(this.interval)
    this.interval = window.setTimeout(
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
      this.timeout,
      true
    )
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
    if (targeting) {
      Object.keys(targeting).forEach((targetingKey: string) => {
        slot && slot.setTargeting(targetingKey, targeting[targetingKey])
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
