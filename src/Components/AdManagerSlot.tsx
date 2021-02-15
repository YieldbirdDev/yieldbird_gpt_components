import React, { useContext, useEffect } from 'react'

import { AdManager } from '../Utils/AdManager'
import { AdManagerContext } from '../Context/AdManagerProvider'

import { isIntersectionObserverAvailable } from '../Utils/intersectionObserver'

interface Props {
  adUnitPath: string
  className?: string
  size: googletag.GeneralSize
  optDiv: string
  sizeMapping?: [googletag.SingleSizeArray, googletag.GeneralSize][]
  targeting?: { [key: string]: googletag.NamedSize }
  lazyLoad?: boolean
}

export const AdManagerSlot: React.FC<Props> = ({
  adUnitPath,
  className,
  size,
  optDiv,
  sizeMapping,
  targeting,
  lazyLoad
}) => {
  const adManagerContext = useContext(AdManagerContext)

  useEffect(() => {
    const refresh = adManagerContext.shouldRefresh(optDiv)

    AdManager.defineSlot(
      adUnitPath,
      size,
      optDiv,
      refresh,
      sizeMapping,
      targeting,
      lazyLoad
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
      AdManager.destroySlot(optDiv)
    }
  }, [])

  return <div id={optDiv} className={className} />
}
