/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string
  const svgComponent: SvgrComponent
  export default svgUrl
  export { svgComponent as ReactComponent }
}

interface Googletag {
  _loaded(): void
  cmd: googletag.CommandArray
  defineSlot(
    adUnitPath: string,
    size: googletag.GeneralSize,
    optDiv?: string
  ): googletag.Slot
  destroySlots(slots: googletag.Slot[]): void
  display(divOrSlot?: string | Element | googletag.Slot): void
  enableServices(): void
  pubads(): googletag.PubAdsService
  sizeMapping(): googletag.SizeMappingBuilder
}

interface LazySlot {
  slot: googletag.Slot
  targetingReady: boolean
}

interface Window {
  googletag: Googletag
  // eslint-disable-next-line camelcase
  yb_configuration: { lazyLoad: boolean }
  Yieldbird: Yieldbird
}

interface Yieldbird {
  cmd: Function[]
  setGPTTargeting(slots: googletag.Slot[]): void
  refresh(slots?: googletag.Slot[]): void
  retarget(slots?: googletag.Slot[]): void
}

declare module 'gpt-mock'
