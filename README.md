# yieldbird_gpt_components

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/yieldbird_gpt_components.svg)](https://www.npmjs.com/package/yieldbird_gpt_components) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

- [QuickWrap - Yieldbird GPT Components](#yieldbird_gpt_components)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Development](#development)

## Install

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

`AdManagerSlot` is a simple ad component, with properties similar to GPT slot. It is responsible for rendering ad in specified place. You can use it with following properties:
| name | type | required | description |
| :---- |  :----:  |  :----:  | :---- |
| `adUnitPath` | string | true | Google AdManager ad unit path |
| `size` | number | true | base slot sizes |
| `optDiv` | string | true | name of DIV ID of given adUnit |
| `targeting` | object | false | extra targeting object which can be used to pass aditional key-values pairs to GAM |
| `sizeMapping` | array | false | array representation of size mapping GPT command calls. Each array element consists of two more arrays, representing viewport size and mapping which correspnds to [GPT setup](https://developers.google.com/publisher-tag/reference#googletag.sizemappingbuilder). |

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

```
# (in another tab)
cd example
npm start # runs create-react-app dev server
```

Now, anytime you make a change to your library in src/ or to the example app's example/src, create-react-app will live-reload your local dev server so you can iterate on your component in real-time.

## License

MIT © [YieldbirdDev](https://github.com/YieldbirdDev)
