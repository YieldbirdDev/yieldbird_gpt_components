import { isIntersectionObserverAvailable } from '../intersectionObserver'

export function defineSlot(
  adUnitPath: string,
  size: googletag.GeneralSize,
  optDiv: string,
  shouldRefreshAds: boolean,
  sizeMapping?: [googletag.SingleSizeArray, googletag.GeneralSize][],
  targeting?: { [key: string]: googletag.NamedSize },
  lazyLoad?: boolean,
  optOptions?: { changeCorrelator: boolean } | undefined
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

            !shouldRefreshAds &&
              window.googletag.pubads().refresh([slot], optOptions)
          }

          slot ? resolve(slot) : reject(new Error('Slot could not be created.'))
        })
      })
    } else {
      reject(new Error('Slot could not be created.'))
    }
  })
}

function createSlot(
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

function setSizeMapping(
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

function setTargeting(
  slot: googletag.Slot,
  targeting?: { [key: string]: googletag.NamedSize }
) {
  if (slot && targeting) {
    Object.keys(targeting).forEach((targetingKey: string) => {
      slot.setTargeting(targetingKey, targeting[targetingKey])
    })
  }
}
