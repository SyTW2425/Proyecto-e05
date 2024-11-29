import { mount } from '@vue/test-utils';
import LogIn from '../src/components/LogIn.vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import AlertComponent from '../src/components/AlertComponent.vue';
import { describe, it, expect, beforeEach } from 'vitest';

const mockLogin = async () => true;

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: { template: '<div>Home</div>' },
    },
  ],
});

setActivePinia(createPinia());

describe('LogIn.vue', () => {
  let wrapper;

  beforeEach(() => {
    const authStore = {
      login: mockLogin,
    };

    wrapper = mount(LogIn, {
      global: {
        plugins: [router, createPinia()],
      },
      mocks: {
        $store: authStore,
      },
    });
  });

  it('renders login form', () => {
    const loginForm = wrapper.find('form');
    expect(loginForm.exists()).toBe(true);

    const usernameInput = wrapper.find('input[name="username"]');
    const passwordInput = wrapper.find('input[name="password"]');
    expect(usernameInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
  }); 
});