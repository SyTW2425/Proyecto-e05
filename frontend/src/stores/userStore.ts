// src/store/userStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),

  actions: {
    setUser(user: any) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
    async fetchUser(userId: string) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/${userId}`,
        );
        this.setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    },
  },

  persist: true,
});
