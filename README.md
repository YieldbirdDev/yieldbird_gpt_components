# yieldbird_gpt_components

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/yieldbird_gpt_components.svg)](https://www.npmjs.com/package/yieldbird_gpt_components) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

- [QuickWrap - Yieldbird GPT Components](#yieldbird_gpt_components)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Development](#development)

## Installation

```bash
npm install --save yieldbird_gpt_components
```

## Usage

```tsx
import React, { Component } from 'react'

import { AdManagerProvider, AdManagerSlot } from 'yieldbird_gpt_components'

return (
  <AdManagerProvider uuid='YOUR_YIELDBIRD_WRAPPER_UUID'>
    <AdManagerSlot
      adUnitPath='AD_UNIT_PATH/FOO'
      size={[[120, 600], [160, 600]]}
      optDiv='AD_UNIT_DIV_ID'
    />
  </AdManagerProvider>
)
```

`AdManagerProvider` context component should be placed at the top of your React app. It is responsible for injecting GPT and Yieldbird Wrapper scripts, initializing variables and storing helper data.
| name | type | required | description |
| :---- |  :----:  |  :----:  | :---- |
| `collapseEmptyDivs` | boolean | false | Google AdManager collapseEmptyDivs option. If no parameter is specified, true will be passed as a collapseEmptyDivs argument. |
| `globalTargeting` | object | false | targeting object which can be used to pass aditional key-values pairs to pubads object |
| `uuid` | string | false | Yieldbird UUID required to load Wrapper script. If not set, you need to provide scripts in your head section, see [Head section](#head-script) |
| `onImpressionViewable` | function | false | Callback function for 'impressionViewable' event |
| `onSlotOnload` | function | false | Callback function for 'slotOnload' event |
| `onSlotRender` | function | false | Callback function for 'slotRenderEnded' event |
| `onSlotRequested` | function | false | Callback function for 'slotRequested' event |
| `onSlotResponseReceived` | function | false | Callback function for 'slotResponseReceived' event |
| `onSlotVisibilityChanged` | function | false | Callback function for 'slotVisibilityChanged' event |
| `lazyLoadOffset` | number | false | Lazy loading offset in relation to viewport (example: 0.5 = 50% of viewport) |
| `isMobile` | boolean | false | Mobile device flag. Mainly used for setting default lazy load offset when no offset is provided by default |

You can find more about GPT events on the official [Google docs](https://developers.google.com/publisher-tag/reference#googletag.events.event). |

`AdManagerSlot` is a simple ad component, with properties similar to GPT slot. It is responsible for rendering ad in specified place. You can use it with following properties:
| name | type | required | description |
| :---- |  :----:  |  :----:  | :---- |
| `adUnitPath` | string | true | Google AdManager ad unit path |
| `size` | number | true | base slot sizes |
| `optDiv` | string | true | name of DIV ID of given adUnit |
| `targeting` | object | false | extra targeting object which can be used to pass aditional key-values pairs to GAM |
| `sizeMapping` | array | false | array representation of size mapping GPT command calls. Each array element consists of two more arrays, representing viewport size and mapping which correspnds to [GPT setup](https://developers.google.com/publisher-tag/reference#googletag.sizemappingbuilder). |
| `lazyLoad` | boolean | false | whether given adUnit should be lazy loaded |
| `screeningAd` | boolean | false | Screening ad flag. When ads is set as screening ad, it will reset body background when unmounted |


### Head script

In case you want to boost your performance, you may want to set dependency scripts in head section. In this case, see below example of how to properly implement it. Make sure not to set uuid in your AdManagerProvider

```html
  <script type='text/javascript'>
    window.googletag = window.googletag || {}
    window.googletag.cmd = window.googletag.cmd || []
    window.Yieldbird = window.Yieldbird || {}
    window.Yieldbird.cmd = window.Yieldbird.cmd || []

    window.yb_configuration = { lazyLoad: true }

    window.googletag.cmd.push(function () {
      window.googletag.pubads().disableInitialLoad()
    })
  </script>
  <script type='text/javascript' async src='//securepubads.g.doubleclick.net/tag/js/gpt.js'></script>
  <script type='text/javascript' async src='//jscdn.yieldbird.com/{ENTER_YOUR_YIELDBIRD_UUID_HERE}/yb.js'></script>
```

### Additional targeting example
```tsx
<AdManagerSlot
  adUnitPath='AD_UNIT_PATH/FOO'
  size={[[120, 600], [160, 600]]}
  optDiv='AD_UNIT_DIV_ID'
  targeting={{
    foo: 'bar',
    bar: 'baz'
  }}
/>
```

### Size mapping example
```tsx
<AdManagerSlot
  adUnitPath='AD_UNIT_PATH/FOO'
  size={[[120, 600], [160, 600]]}
  optDiv='AD_UNIT_DIV_ID'
  sizeMapping={[
    [[0, 0], [[120, 600], [160, 600]]],
    [[600, 0], [[300, 600]]]
  ]}
/>
```

## Development

Local development is broken into two parts (ideally using two tabs).

First, run rollup to watch your src/ module and automatically recompile it into dist/ whenever you make changes.

```
npm start # runs rollup with watch flag
```

The second part will be running the example/ create-react-app that's linked to the local version of your module.

Make sure to configure your config.ts file basing on config.ts.example.

```
# (in another tab)
cd example
npm start # runs create-react-app dev server
```

Now, anytime you make a change to your library in src/ or to the example app's example/src, create-react-app will live-reload your local dev server so you can iterate on your component in real-time.

## License

MIT © [YieldbirdDev](https://github.com/YieldbirdDev)
