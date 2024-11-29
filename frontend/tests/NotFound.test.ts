import { mount } from '@vue/test-utils';
import NotFound from '../src/components/NotFound.vue'; // Adjust path as needed
import { describe, it, expect } from 'vitest';

describe('NotFound.vue', () => {
  it('renders the 404 error message', () => {
    const wrapper = mount(NotFound);

    const heading = wrapper.find('h1');
    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe('404');

    const paragraph = wrapper.find('p');
    expect(paragraph.exists()).toBe(true);
    expect(paragraph.text()).toContain('Oops! Page Not Found');
  });

  it('renders the Go Home button and checks its link', () => {
    const wrapper = mount(NotFound);

    const goHomeButton = wrapper.find('router-link[to="/home"]');
    expect(goHomeButton.exists()).toBe(true);
    expect(goHomeButton.text()).toBe('Go Home');
    expect(goHomeButton.attributes('to')).toBe('/home');
  });

  it('renders the Contact Us button and checks its link', () => {
    const wrapper = mount(NotFound);

    const contactButton = wrapper.find('router-link[to="/contact"]');
    expect(contactButton.exists()).toBe(true);
    expect(contactButton.text()).toBe('Contact Us');
    expect(contactButton.attributes('to')).toBe('/contact');
  });

  it('renders the SVG element', () => {
    const wrapper = mount(NotFound);

    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
  });
});