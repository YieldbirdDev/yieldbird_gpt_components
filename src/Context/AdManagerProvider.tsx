import React, { useCallback, useEffect, useState } from 'react'

import { AdManager } from '../Utils/AdManager'
import { initializeAdStack } from '../Utils/headerScripts'

interface Props {
  uuid: string
  refreshDelay?: number
}

export const AdManagerContext = React.createContext({
  shouldRefresh: (_optDiv: string) => false as boolean,
  refreshAd: (_slot: googletag.Slot, _optDiv: string): void => {},
  registerSlot: (_slot: googletag.Slot): void => {}
})

export const AdManagerProvider: React.FC<Props> = ({
  children,
  uuid,
  refreshDelay
}) => {
  const adManager = new AdManager(refreshDelay)
  const [adsMap, setAdsMap] = useState<string[]>([])

  const registerSlot = useCallback(
    (slot: googletag.Slot) => {
      adsMap.push(slot.getSlotElementId())
      setAdsMap(adsMap)
    },
    [adsMap, setAdsMap]
  )

  const refreshAd = useCallback(
    (slot: googletag.Slot, optDiv: string) => {
      adManager.refreshSlot(slot, optDiv)
    },
    [adManager]
  )

  const shouldRefresh = useCallback((optDiv: string) => {
    return adsMap.includes(optDiv)
  }, adsMap)

  useEffect(() => {
    initializeAdStack(uuid)
  }, [uuid])

  return (
    <AdManagerContext.Provider
      value={{
        refreshAd,
        registerSlot,
        shouldRefresh
      }}
    >
      {children}
    </AdManagerContext.Provider>
  )
}
