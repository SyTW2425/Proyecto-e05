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
      profilePicture: '../public/default-profile.png',
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

    wrapper = mount(Navbar, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('renders the profile image with the correct src', () => {
    const profileImage = wrapper.find('img');
    expect(profileImage.exists()).toBe(true);
    expect(profileImage.attributes('src')).toBe(
      mockUserStore.user.profilePicture,
    );
  });
});