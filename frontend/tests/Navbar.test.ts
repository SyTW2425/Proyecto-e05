import { mount } from '@vue/test-utils';
import Navbar from '../src/components/Navbar.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useRouter } from 'vue-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../src/stores/auth';
import { useUserStore } from '../src/stores/userStore';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
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
      profilePicture: '/path/to/profile-picture.png',
      username: 'Test User',
    },
    fetchUser: vi.fn(),
  })),
}));

describe('Navbar.vue', () => {
  let wrapper;
  let mockAuthStore;
  let mockRouter;
  let mockUserStore;

  beforeEach(() => {
    // Create and set up the Pinia store
    const pinia = createPinia();
    setActivePinia(pinia);

    mockRouter = {
      push: vi.fn(),
    };

    vi.clearAllMocks();

    // Mock router and auth store
    useRouter.mockReturnValue(mockRouter);
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

  it('renders the Log Out button', () => {
    const logOutButton = wrapper.find('button');
    expect(logOutButton.exists()).toBe(true);
    expect(logOutButton.text()).toBe('Log Out');
  });
});
