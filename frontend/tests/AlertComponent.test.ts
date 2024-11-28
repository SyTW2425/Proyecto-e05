import { mount } from '@vue/test-utils';
import Alert from '../src/components/AlertComponent.vue';
import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect } from 'vitest';
import { useAlertStore } from '../src/stores/alert';

describe('Alert.vue', () => {
  let wrapper;
  let alertStore;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    wrapper = mount(Alert, {
      global: {
        plugins: [pinia],
      },
    });


    alertStore = useAlertStore();
  });

  it('renders success alert with correct class and message', async () => {
    alertStore.success('This is a success message!');

    await wrapper.vm.$nextTick();

    const alertDiv = wrapper.find('.alert-success');
    expect(alertDiv.exists()).toBe(true);
    expect(alertDiv.text()).toBe('This is a success message!');
  });

  it('renders danger alert with correct class and message', async () => {
    alertStore.error('This is a danger message!');

    await wrapper.vm.$nextTick();

    const alertDiv = wrapper.find('.alert-danger');
    expect(alertDiv.exists()).toBe(true);
    expect(alertDiv.text()).toBe('This is a danger message!');
  });

  it('does not render any alert when no alert message is provided', async () => {
    alertStore.clear();

    await wrapper.vm.$nextTick();

    const alertDiv = wrapper.find('div');
    expect(alertDiv.exists()).toBe(false);
  });
});