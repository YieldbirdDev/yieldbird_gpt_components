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

import MyComponent from 'yieldbird_gpt_components'
import 'yieldbird_gpt_components/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
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