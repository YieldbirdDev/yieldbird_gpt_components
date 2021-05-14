import React, { useContext, useEffect } from 'react'

import { AdManagerContext } from '../Context/AdManagerProvider'

import { defineSlot, destroySlot } from '../Utils/AdManagerUtils'
import { isIntersectionObserverAvailable } from '../Utils/intersectionObserver'

interface Props {
  adUnitPath: string
  className?: string
  size: googletag.GeneralSize
  optDiv: string
  screeningAd?: boolean
  sizeMapping?: [googletag.SingleSizeArray, googletag.GeneralSize][]
  targeting?: { [key: string]: googletag.NamedSize }
  lazyLoad?: boolean
}

export const AdManagerSlot: React.FC<Props> = ({
  adUnitPath,
  className,
  screeningAd,
  size,
  optDiv,
  sizeMapping,
  targeting,
  lazyLoad
}) => {
  const adManagerContext = useContext(AdManagerContext)

  useEffect(() => {
    const refresh = adManagerContext.shouldRefresh(optDiv)

    defineSlot(
      adUnitPath,
      size,
      optDiv,
      refresh,
      sizeMapping,
      targeting,
      lazyLoad,
      adManagerContext.refreshOptions()
    )
      .then((slot) => {
        adManagerContext.registerSlot(slot)

        if (lazyLoad && isIntersectionObserverAvailable()) {
          refresh
            ? adManagerContext.addToLazyWithRetarget(slot, optDiv)
            : adManagerContext.addToLazyLoad(optDiv)
        } else {
          refresh && adManagerContext.refreshAd(slot, optDiv)
        }
      })
      .catch((e) => {
        console.error(e)
      })

    return () => {
      adManagerContext.removeFromLazyLoad(optDiv)
      destroySlot(optDiv, screeningAd)
    }
  }, [])

  return <div id={optDiv} className={className} />
}
