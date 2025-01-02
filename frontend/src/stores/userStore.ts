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
    activities: [] as any[], // List of activities
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
        await axios.put(`http://localhost:5001/api/users/unfollow`, payload);
        this.following = this.following.filter((id) => id !== unfollowId); // Update state
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
    async fetchUserInfo(userId: string) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/info/${userId}`,
        );
        return response.data; // Return the user data
      } catch (error) {
        console.error('Error fetching user info', error);
        throw new Error('Failed to fetch user info');
      }
    },
    async fetchMovieInfo(movieId: string) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/movies/${movieId}`,
        );
        return response.data; // Return the movie data
      } catch (error) {
        console.error('Error fetching movie info', error);
        throw new Error('Failed to fetch movie info');
      }
    },
    async fetchActivities() {
      const userId = localStorage.getItem('userId'); // Get logged-in user's ID
      if (!userId) {
        console.error('No user ID found in local storage.');
        return;
      }

      try {
        // Fetch activities from the backend API
        const response = await axios.get(
          `http://localhost:5001/api/activity/all/${userId}`,
        );

        // Map the activities and add the `isCurrentUser` property
        this.activities = response.data.map((activity: any) => ({
          ...activity,
          isCurrentUser: activity.user?.id === userId, // Identify if the activity is by the logged-in user
        }));

        // Sort activities by creation date in descending order
        this.activities.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        // each activity has a user property, which contains the userId, from it store the profile picture
        this.activities.forEach(async (activity) => {
          const user = await this.fetchUserInfo(activity.user);
          activity.userProfilePicture = user.profilePicture;
        });

        // get the username of the user that created the activity
        this.activities.forEach(async (activity) => {
          const user = await this.fetchUserInfo(activity.user);
          activity.username = user.username;
          if (localStorage.getItem('userId') === activity.user) {
            activity.isCurrentUser = true;
            activity.username = 'You';
          }
        });
      } catch (error) {
        console.error(
          'Failed to fetch activities:',
          error.response?.data?.message || error.message,
        );
      }
    },
    async fetchUserActivities(userId: string) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/activity/user/${userId}`,
        );
        this.activities = response.data;

        // each activity has a user property, which contains the userId, from it store the profile picture
        this.activities.forEach(async (activity) => {
          const user = await this.fetchUserInfo(activity.user);
          activity.userProfilePicture = user.profilePicture;
        });

        this.activities.forEach(async (activity) => {
          const user = await this.fetchUserInfo(activity.user);
          activity.username = user.username;
          if (localStorage.getItem('userId') === activity.user) {
            activity.isCurrentUser = true;
            activity.username = 'You';
          }
        });
        
        return this.activities;
      } catch (error) {
        console.error('Failed to fetch user activities:', error);
      }
    },
  },

  persist: true,
});
