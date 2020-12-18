import React, { useCallback, useState } from 'react'

import { AdManagerProvider, AdManagerSlot } from 'yieldbird_gpt_components'
import 'yieldbird_gpt_components/dist/index.css'

const App = () => {
  const [toggle, setToggle] = useState<boolean>(true)
  const buttonHandler = useCallback(() => {
      setToggle(!toggle)
  }, [toggle, setToggle])

  return (
    <AdManagerProvider uuid={'a81dc6d2-be53-4481-9012-812bbbec9109'}>
      <div>
        <div>
          AD 1
          { toggle && <AdManagerSlot
            adUnitPath='52555387/dazzling.news_160x600'
            size={[[120, 600], [160, 600]]}
            optDiv='paralos-300x250_mobile'
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
        <div>
          AD 2
          { toggle && <AdManagerSlot
            adUnitPath='/52555387/dazzling.news_336x280_1'
            size={[[336, 280]]}
            optDiv='paralos-336x280_1'
          /> }
        </div>
        <button onClick={buttonHandler}>Toggle {toggle ? 'OFF' : 'ON'} ads</button>
      </div>
    </AdManagerProvider>
  )
}

export default App
