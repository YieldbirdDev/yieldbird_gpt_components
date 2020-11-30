import React, { useContext, useEffect } from 'react'

import { AdManager } from '../Utils/AdManager'
import { AdManagerContext } from '../Context/AdManagerProvider'

interface Props {
  adUnitPath: string
  size: googletag.GeneralSize
  optDiv: string
  sizeMapping?: [googletag.SingleSizeArray, googletag.GeneralSize][]
  targeting?: { [key: string]: googletag.NamedSize }
}

export const AdManagerSlot: React.FC<Props> = ({
  adUnitPath,
  size,
  optDiv,
  sizeMapping,
  targeting
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
      targeting
    )
      .then((slot) => {
        adManagerContext.registerSlot(slot)
        refresh && adManagerContext.refreshAd(slot, optDiv)
      })
      .catch((e) => {
        console.error(e)
      })

    return () => {
      AdManager.destroySlot(optDiv)
    }
  }, [adManagerContext])

  return <div id={optDiv} />
}
