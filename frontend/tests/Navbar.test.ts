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
      profilePicture: '/default-profile.png', // Ensure this is set correctly
      username: 'Test User',
    },
    fetchUser: vi.fn(),
    fetchUsers: vi.fn(),
    fetchFollowing: vi.fn(),
  })),
}));

describe('Navbar.vue', () => {
  let wrapper;
  let mockAuthStore;
  let mockRouter;
  let mockUserStore;
  let mockRoute;

  beforeEach(() => {
    // Create and set up the Pinia store
    const pinia = createPinia();
    setActivePinia(pinia);

    mockRouter = {
      push: vi.fn(),
    };

    mockRoute = {
      name: 'Home', // Simulate the current route
    };

    vi.clearAllMocks();

    // Mock router and stores
    useRouter.mockReturnValue(mockRouter);
    useRoute.mockReturnValue(mockRoute);
    mockAuthStore = useAuthStore();
    mockUserStore = useUserStore();

    // Mocking the localStorage to return a valid userId for the test
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

  it('renders the profile image', () => {
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true); // Check if the image element exists
    expect(img.attributes('src')).toBe('/logo.svg'); // Verify the image src attribute
  });

  it('renders the profile link with the correct route', () => {
    const profileLink = wrapper.find('router-link');
    expect(profileLink.exists()).toBe(true); // Ensure the link exists
    expect(profileLink.attributes('to')).toBe('/home'); // Ensure the correct profile URL
  });
});