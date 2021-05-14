export function destroySlot(optDiv: string, screeningAd?: boolean) {
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
