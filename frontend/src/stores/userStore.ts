import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    users: [] as any[],
    showSearchModal: false,
    searchQuery: '',
    filteredUsers: [] as any[],
    selectedUser: null,
    showFriendRequestPopup: false,
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
    async fetchUsers() {
      try {
        const response = await axios.get(`http://localhost:5001/api/users`);
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users', error);
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
    sendFriendRequest(targetUserId: string) {
      try {
        // Call your API to send a friend request
        axios.post(`http://localhost:5001/api/friend-requests`, {
          senderId: this.user!._id,
          recipientId: targetUserId,
        });
        alert('Friend request sent successfully!');
        this.showFriendRequestPopup = false;
      } catch (error) {
        console.error('Error sending friend request', error);
      }
    },
    cancelFriendRequest() {
      this.showFriendRequestPopup = false;
    }
  },

  persist: true,
});