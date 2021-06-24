import { mount } from '@vue/test-utils'
import Reader from '@/views/Reader.vue'

describe('Home.vue', () => {
  it('renders home vue', () => {
    const wrapper = mount(Reader)
    expect(wrapper.text()).toMatch('Ready to create an app?')
  })
})
