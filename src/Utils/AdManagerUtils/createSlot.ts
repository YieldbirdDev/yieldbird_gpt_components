export function createSlot(
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
