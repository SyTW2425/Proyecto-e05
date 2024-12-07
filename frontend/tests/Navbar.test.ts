import { mount } from '@vue/test-utils';
import Navbar from '../src/components/Navbar.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useRouter } from 'vue-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../src/stores/auth';


vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));


vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    logout: vi.fn(),
  })),
}));

describe('Navbar.vue', () => {
  let wrapper;
  let mockAuthStore;
  let mockRouter;

  beforeEach(() => {
    // Create and set up the Pinia store
    const pinia = createPinia();
    setActivePinia(pinia);

    mockRouter = {
      push: vi.fn(),
    };


    mockAuthStore = useAuthStore();

    wrapper = mount(Navbar, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('renders the navigation links', () => {
    const homeLink = wrapper.find('router-link[to="/"]');
    expect(homeLink.exists()).toBe(true);
    expect(homeLink.text()).toBe('About us');

    const filmsLink = wrapper.find('router-link[to="/films"]');
    expect(filmsLink.exists()).toBe(true);
    expect(filmsLink.text()).toBe('Films');
  });

  it('renders the profile image and Log Out button', () => {
    const profileImage = wrapper.find('img');
    expect(profileImage.exists()).toBe(true);
    expect(profileImage.attributes('src')).toBe('/default-profile.png');
    expect(profileImage.attributes('alt')).toBe('Profile Picture');

    const logOutButton = wrapper.find('button');
    expect(logOutButton.exists()).toBe(true);
    expect(logOutButton.text()).toBe('Log Out');
  });
});