import { mount } from '@vue/test-utils';
import Navbar from '../src/components/Navbar.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../src/stores/auth';
import { useUserStore } from '../src/stores/userStore';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn(),
}));

// Mock auth store
vi.mock('../src/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    logout: vi.fn(),
  })),
}));

// Mock user store
vi.mock('../src/stores/userStore', () => ({
  useUserStore: vi.fn(() => ({
    user: {
      profilePicture: '/default-profile.png',
      username: 'TestUser',
    },
    users: [{ _id: 'user123', username: 'TestUser' }],
    fetchUser: vi.fn(),
    fetchUsers: vi.fn(),
    fetchFollowing: vi.fn(),
    following: [],
    showSearchModal: false,
    searchQuery: '',
    filteredUsers: [],
  })),
}));

describe('Navbar.vue', () => {
  let wrapper;
  let mockRouter;
  let mockRoute;
  let mockAuthStore;
  let mockUserStore;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    mockRouter = {
      push: vi.fn(),
    };

    mockRoute = {
      name: 'Home', // Simulate current route name
    };

    vi.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
    useRoute.mockReturnValue(mockRoute);
    mockAuthStore = useAuthStore();
    mockUserStore = useUserStore();

    vi.spyOn(global.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      if (key === 'userId') return 'user123'; // Mock user ID
      return null;
    });

    wrapper = mount(Navbar, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('renders the logo correctly', () => {
    const logo = wrapper.find('img[alt="CineTrunk Logo"]');
    expect(logo.exists()).toBe(true);
    expect(logo.attributes('src')).toBe('/logo.svg');
  });

  it('renders the user profile picture correctly', () => {
    const profileImage = wrapper.find('img[alt="Profile Picture"]');
    expect(profileImage.exists()).toBe(true);
    expect(profileImage.attributes('src')).toBe('/default-profile.png');
  });

  it('toggles mobile menu visibility on button click', async () => {
    const button = wrapper.find('button.md\\:hidden');
    expect(wrapper.vm.isMobileMenuOpen).toBe(false);

    await button.trigger('click');
    expect(wrapper.vm.isMobileMenuOpen).toBe(true);

    await button.trigger('click');
    expect(wrapper.vm.isMobileMenuOpen).toBe(false);
  });


  it('hides navbar on scroll down and shows on scroll up', async () => {
    const initialValue = wrapper.vm.isNavbarHidden;

    // Simulate scrolling down
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));
    expect(wrapper.vm.isNavbarHidden).not.toBe(initialValue);

    // Simulate scrolling up
    window.scrollY = 0;
    window.dispatchEvent(new Event('scroll'));
    expect(wrapper.vm.isNavbarHidden).toBe(false);
  });

  it('computes username correctly based on userStore', () => {
    expect(wrapper.vm.username).toBe('TestUser');
  });

});