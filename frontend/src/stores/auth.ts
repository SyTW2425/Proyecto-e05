import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await axios.post('http://localhost:5001/api/users/login', { username, password });
        this.token = response.data.token;
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async register(name: string, username: string, password: string, email: string) {
      try {
        await axios.post('http://localhost:5001/api/users/register', { name, username, password, email });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    logout() {
      this.token = null;
    },
  }
});