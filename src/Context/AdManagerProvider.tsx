import React, { useCallback, useEffect, useState } from 'react'

import { AdManager } from '../Utils/AdManager'
import { initializeAdStack } from '../Utils/headerScripts'

import { isIntersectionObserverAvailable } from '../Utils/intersectionObserver'

interface Props {
  uuid: string
  refreshDelay?: number
}

export const AdManagerContext = React.createContext({
  addToLazyLoad: (_optDiv: string): void => {},
  addToLazyWithRetarget: (_slot: googletag.Slot, _optDiv: string): void => {},
  shouldRefresh: (_optDiv: string) => false as boolean,
  refreshAd: (_slot: googletag.Slot, _optDiv: string): void => {},
  registerSlot: (_slot: googletag.Slot): void => {},
  removeFromLazyLoad: (_optDiv: string): void => {}
})

export const AdManagerProvider: React.FC<Props> = ({
  children,
  uuid,
  refreshDelay
}) => {
  const [adsMap, setAdsMap] = useState<string[]>([])

  const adManager = new AdManager(refreshDelay)
  const intersectionObserver =
    isIntersectionObserverAvailable() &&
    new IntersectionObserver((entries, observer) => {
      const actionEntries = entries.filter((entry) => entry.isIntersecting)

      if (actionEntries.length > 0) {
        window &&
          window.googletag.cmd.push(() => {
            const displayEntries = actionEntries.map((entry) => ({
              slot:
                window &&
                window.googletag
                  .pubads()
                  .getSlots()
                  .find(
                    (element) => element.getSlotElementId() === entry.target.id
                  ),
              target: entry.target
            }))

            displayEntries.forEach((element) => {
              if (window && window.googletag && element.slot) {
                window.googletag.display(element.slot.getSlotElementId())
                window.googletag.pubads().refresh([element.slot])
              }
            })
          })

        actionEntries.forEach((element) => {
          observer.unobserve(element.target)
        })
      }
    })

  const addToLazyLoad = useCallback((optDiv: string) => {
    const element = document.getElementById(optDiv)
    intersectionObserver && element && intersectionObserver.observe(element)
  }, [])

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

  const removeFromLazyLoad = useCallback((optDiv) => {
    const element = document.getElementById(optDiv)

    intersectionObserver && element && intersectionObserver.unobserve(element)
  }, [])

  const addToLazyWithRetarget = useCallback(
    (slot: googletag.Slot, optDiv: string) => {
      intersectionObserver &&
        adManager.retargetSlot(slot, optDiv, intersectionObserver)
    },
    []
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
        addToLazyLoad,
        addToLazyWithRetarget,
        refreshAd,
        registerSlot,
        removeFromLazyLoad,
        shouldRefresh
      }}
    >
      {children}
    </AdManagerContext.Provider>
  )
}
