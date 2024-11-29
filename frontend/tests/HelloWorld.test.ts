import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HelloWorld from '../src/components/HelloWorld.vue' // Adjust the path if necessary

describe('HelloWorld.vue', () => {
  it('renders the msg prop correctly', () => {
    const msg = 'Hello Vue!'
    const wrapper = mount(HelloWorld, {
      props: { msg }
    })

    expect(wrapper.text()).toContain(msg)
  })

  it('increases count when the button is clicked', async () => {
    const wrapper = mount(HelloWorld)
    
    const button = wrapper.find('button')
    expect(button.text()).toContain('count is 0')

    // Simulate button click to increment count
    await button.trigger('click')
    expect(button.text()).toContain('count is 1')

    // Click again
    await button.trigger('click')
    expect(button.text()).toContain('count is 2')
  })

  it('renders static text', () => {
    const wrapper = mount(HelloWorld)

    // Check if static text exists in the template
    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.text()).toContain('Check out')
    expect(wrapper.text()).toContain('Learn more about IDE Support for Vue')
    expect(wrapper.text()).toContain('Click on the Vite and Vue logos')
  })
})