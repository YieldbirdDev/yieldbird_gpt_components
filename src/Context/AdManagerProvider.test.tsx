import React from 'react'
import { AdManagerProvider } from '../Context/AdManagerProvider'

import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

describe('AdManagerSlot', () => {
  it('renders slot properly', async () => {
    const wrapper = mount(<AdManagerProvider uuid='test' />)

    await act(async () => {
      wrapper.update()
    })

    expect(window.Yieldbird?.cmd).toHaveLength(0)
    expect(window.googletag?.cmd).toHaveLength(2)
  })
})
