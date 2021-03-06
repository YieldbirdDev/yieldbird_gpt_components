import React, { useCallback, useState } from 'react'

import { AdManagerProvider, AdManagerSlot } from 'yieldbird_gpt_components'
import { config } from './config/config'

const App = () => {
  const [toggle, setToggle] = useState<boolean>(true)
  const buttonHandler = useCallback(() => {
      setToggle(!toggle)
  }, [toggle, setToggle])

  return (
    <AdManagerProvider
      uuid={config.uuid}
      collapseEmptyDivs
      globalTargeting={
        {
          test_global: '1'
        }
      }
      onImpressionViewable={(event) => { console.log('impresion viewable!', event) }}
      onSlotRequested={(event) => { console.log('slot requested!', event) }}
    >
      <div>
        <div>
          AD 1
          { toggle && <AdManagerSlot
            adUnitPath={config.unitPath}
            className='test'
            size={[[120, 600], [160, 600]]}
            optDiv={config.optDiv}
            sizeMapping={[
              [[0,0], [[120, 600], [160, 600]]],
              [[600,0], [[300, 600]]]
            ]}
            screeningAd
            targeting={{
              test: 'ao',
              foo: 'bar'
            }}
            lazyLoad={true}
          /> }
        </div>
        <button onClick={buttonHandler}>Toggle {toggle ? 'OFF' : 'ON'} ads</button>
        <div style={ { height: '1300px' } }/>
        <div>
          AD 2
        </div>
      </div>
      <AdManagerSlot
        adUnitPath={config.unitPath2}
        size={[[336, 280]]}
        optDiv={config.optDiv2}
        lazyLoad={true}
      />
    </AdManagerProvider>
  )
}

export default App
