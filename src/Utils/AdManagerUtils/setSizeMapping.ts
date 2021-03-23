export function setSizeMapping(
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
