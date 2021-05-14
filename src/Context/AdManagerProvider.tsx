import React, { useCallback, useEffect, useState } from 'react'

import { AdManager } from '../Utils/AdManager'
import { initializeAdStack } from '../Utils/headerScripts'

import {
  isIntersectionObserverAvailable,
  intersectionObserverCallback,
  intersectionObserverOptions
} from '../Utils/intersectionObserver'

interface Props {
  collapseEmptyDivs?: boolean
  globalTargeting?: Record<string, string>
  lazyLoadOffset?: number
  isMobile?: boolean
  uuid?: string
  refreshDelay?: number
  enableSingleRequest?: boolean
  updateCorrelator?: boolean
  onImpressionViewable?: (
    event: googletag.events.ImpressionViewableEvent
  ) => void
  onSlotOnload?: (event: googletag.events.SlotOnloadEvent) => void
  onSlotRender?: (event: googletag.events.SlotRenderEndedEvent) => void
  onSlotRequested?: (event: googletag.events.SlotRequestedEvent) => void
  onSlotResponseReceived?: (
    event: googletag.events.SlotResponseReceived
  ) => void
  onSlotVisibilityChanged?: (
    event: googletag.events.SlotVisibilityChangedEvent
  ) => void
}

export const AdManagerContext = React.createContext({
  addToLazyLoad: (_optDiv: string): void => {},
  addToLazyWithRetarget: (_slot: googletag.Slot, _optDiv: string): void => {},
  shouldRefresh: (_optDiv: string) => false as boolean,
  refreshAd: (_slot: googletag.Slot, _optDiv: string): void => {},
  registerSlot: (_slot: googletag.Slot): void => {},
  removeFromLazyLoad: (_optDiv: string): void => {},
  refreshOptions: (): { changeCorrelator: boolean } | undefined => undefined
})

export const AdManagerProvider: React.FC<Props> = ({
  children,
  lazyLoadOffset,
  isMobile,
  uuid,
  refreshDelay,
  collapseEmptyDivs,
  globalTargeting,
  enableSingleRequest,
  updateCorrelator,
  onImpressionViewable,
  onSlotOnload,
  onSlotRender,
  onSlotRequested,
  onSlotResponseReceived,
  onSlotVisibilityChanged
}) => {
  const [adsMap, setAdsMap] = useState<string[]>([])

  const refreshOptions = useCallback(() => {
    return updateCorrelator ? undefined : { changeCorrelator: false }
  }, [updateCorrelator])

  const adManager = new AdManager(refreshDelay, refreshOptions())

  const intersectionObserver =
    isIntersectionObserverAvailable() &&
    new IntersectionObserver(
      intersectionObserverCallback(refreshOptions()),
      intersectionObserverOptions(isMobile, lazyLoadOffset)
    )

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
    uuid && initializeAdStack(uuid, enableSingleRequest)

    adManager.initiaizeGlobalGPTOptions(
      collapseEmptyDivs,
      globalTargeting,
      onImpressionViewable,
      onSlotOnload,
      onSlotRender,
      onSlotRequested,
      onSlotResponseReceived,
      onSlotVisibilityChanged
    )
  }, [uuid, enableSingleRequest])

  return (
    <AdManagerContext.Provider
      value={{
        addToLazyLoad,
        addToLazyWithRetarget,
        refreshAd,
        registerSlot,
        removeFromLazyLoad,
        shouldRefresh,
        refreshOptions
      }}
    >
      {children}
    </AdManagerContext.Provider>
  )
}
