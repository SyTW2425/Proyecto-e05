import { defineStore } from 'pinia';
import axios from 'axios';
import { useAlertStore } from './alert';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // Current logged-in user
    users: [] as any[], // List of all users
    showSearchModal: false,
    searchQuery: '',
    filteredUsers: [] as any[], // Filtered users from search
    selectedUser: null,
    showFriendRequestPopup: false,
    following: [] as string[], // List of user IDs the logged-in user is following
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
        await this.fetchFollowing(userId);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get(`http://localhost:5001/api/users`);
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users', error);
      }
    },
    async fetchFollowing(userId: string) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/following/${userId}`,
        );
        // Map to only user IDs if the API returns user objects
        this.following = response.data.map((user: any) => user._id);
      } catch (error) {
        console.error('Error fetching following data', error);
      }
    },
    async fetchFollowers(userId: string) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/followers/${userId}`,
        );
        return response.data;
      } catch (error) {
        console.error('Error fetching followers data', error);
      }
    },
    async followUser(followId: string) {
      const alertStore = useAlertStore();
      try {
        const userId = localStorage.getItem('userId');
        const payload = { userId, followId };
        await axios.put(`http://localhost:5001/api/users/follow`, payload);
        this.following.push(followId);
        console.log('User followed successfully');
      } catch (error) {
        alertStore.error(
          error.response?.data?.message || 'Failed to follow the user',
        );
        console.error('Error following user', error);
      }
    },
    async unfollowUser(unfollowId: string) {
      const alertStore = useAlertStore();
      try {
        const userId = localStorage.getItem('userId');
        const payload = { userId, unfollowId };
        console.log('payload', payload);
        await axios.put(`http://localhost:5001/api/users/unfollow`, payload);
        this.following = this.following.filter((id) => id !== unfollowId); // Update state
        console.log('User unfollowed successfully');
      } catch (error) {
        alertStore.error(
          error.response?.data?.message || 'Failed to unfollow the user',
        );
        console.error('Error unfollowing user', error);
      }
    },
    searchUsers() {
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    },
    selectUser(user: any) {
      this.selectedUser = user;
      this.showFriendRequestPopup = true;
    },
  },

  persist: true,
});
