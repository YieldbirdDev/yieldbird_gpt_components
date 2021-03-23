export function setTargeting(
  slot: googletag.Slot,
  targeting?: { [key: string]: googletag.NamedSize }
) {
  if (slot && targeting) {
    Object.keys(targeting).forEach((targetingKey: string) => {
      slot.setTargeting(targetingKey, targeting[targetingKey])
    })
  }
}
