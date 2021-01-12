import React, { useCallback, useState } from 'react'

import { AdManagerProvider, AdManagerSlot } from 'yieldbird_gpt_components'
import { config } from './config/config'

const App = () => {
  const [toggle, setToggle] = useState<boolean>(true)
  const buttonHandler = useCallback(() => {
      setToggle(!toggle)
  }, [toggle, setToggle])

  return (
    <AdManagerProvider uuid={config.uuid}>
      <div>
        <div>
          AD 1
          { toggle && <AdManagerSlot
            adUnitPath={config.unitPath}
            size={[[120, 600], [160, 600]]}
            optDiv={config.optDiv}
            sizeMapping={[
              [[0,0], [[120, 600], [160, 600]]],
              [[600,0], [[300, 600]]]
            ]}
            targeting={{
              test: 'ao',
              foo: 'bar'
            }}
          /> }
        </div>
        <button onClick={buttonHandler}>Toggle {toggle ? 'OFF' : 'ON'} ads</button>
      </div>
    </AdManagerProvider>
  )
}

export default App
