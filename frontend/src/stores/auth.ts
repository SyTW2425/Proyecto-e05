import { defineStore } from 'pinia';
import axios from 'axios';
import { useAlertStore } from './alert'; // Import the alert store

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
  }),
  actions: {
    async login(username: string, password: string) {
      const alertStore = useAlertStore(); // Use the alert store
      try {
        const response = await axios.post(
          'http://localhost:5001/api/users/login',
          { username, password },
        );
        this.token = response.data.token;
        alertStore.success(response.data.message);
        return true;
      } catch (error) {
        alertStore.error(
          (error as any).response?.data?.message || 'Error logging in',
        );
        console.error(error);
        return false;
      }
    },
    async register(
      name: string,
      username: string,
      email: string,
      password: string,
    ) {
      const alertStore = useAlertStore(); // Use the alert store


      try {
        await axios.post('http://localhost:5001/api/users/register', {
          name,
          username,
          email,
          password,
        });
        alertStore.success('Registration successful');
        return true;
      } catch (error) {
        alertStore.error(
          (error as any).response?.data?.message || 'Error registering user',
        );
        console.error(error);
        return false;
      }
    },
    logout() {
      this.token = null;
      const alertStore = useAlertStore(); // Use the alert store
      alertStore.success('Logged out successfully');
    },
  },
  persist: true,
});
