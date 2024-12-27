<template>
  <header :class="{ 'hidden': isNavbarHidden }" class="w-full bg-transparent fixed top-0 left-0 z-50 transition-all">
    <div class="flex justify-between items-center px-4 py-3 md:px-8 lg:px-16">
      <!-- Logo / Title -->
      <router-link to="/home" class="text-white text-lg lg:text-2xl font-bold no-hover" exact>
        CineTrunk
      </router-link>

      <!-- Burger Button (visible on small screens) -->
      <button @click="toggleMobileMenu" class="md:hidden text-white focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex space-x-4">
        <router-link to="/films"
          class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded hover:border-b-2 hover:border-yellow-500 transition duration-200"
          active-class="border-b-2 border-yellow-500">
          Films
        </router-link>
        <router-link to="/"
          class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded hover:border-b-2 hover:border-yellow-500 transition duration-200"
          active-class="border-b-2 border-yellow-500">
          About us
        </router-link>
      </nav>

      <!-- Profile, Search, & Log Out -->
      <div class="flex items-center space-x-4">
        <!-- Search Button: Only visible on Profile page -->
        <button v-if="isProfilePage" @click="toggleSearchModal"
          class="text-yellow-500 text-2xl hover:text-yellow-400 transition">
          <i class="fas fa-search"></i>
        </button>

        <router-link :to="`/profile/${userId}`" class="relative w-10 h-10 rounded-full overflow-hidden">
          <img :src="userStore.user.profilePicture || '/default-profile.png'" alt="Profile Picture"
            class="w-full h-full object-cover border-2 border-transparent hover:border-yellow-500 transition-all rounded-full" />
        </router-link>

        <button @click="logout"
          class="text-white bg-red-500 hover:bg-red-400 px-4 py-2 text-sm lg:text-base rounded transition">
          Log Out
        </button>
      </div>
    </div>

    <!-- Mobile Menu (always below the "CineTrunk" logo) -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-gray-900 px-4 pt-4 pb-2">
      <nav class="space-y-2">
        <router-link to="/home"
          class="block text-white px-4 py-2 rounded hover:border-b-2 hover:border-yellow-500 transition duration-200">
          Home
        </router-link>
        <router-link to="/films"
          class="block text-white px-4 py-2 rounded hover:border-b-2 hover:border-yellow-500 transition duration-200">
          Films
        </router-link>
        <router-link to="/"
          class="block text-white px-4 py-2 rounded hover:border-b-2 hover:border-yellow-500 transition duration-200">
          About us
        </router-link>
      </nav>
    </div>


    <!-- Search User -->
    <div v-if="userStore.showSearchModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-poppins">
      <div class="bg-gray-800 p-6 rounded-lg w-96 max-w-full">
        <h3 class="text-2xl text-yellow-500 mb-6 text-center">Search Users</h3>

        <!-- Search Input -->
        <input v-model="userStore.searchQuery" type="text" placeholder="Enter username..."
          class="w-full bg-gray-700 p-3 rounded-lg text-white text-base mb-4 focus:ring-2 focus:ring-yellow-500 outline-none" />

        <!-- User List -->
        <ul>
          <li v-for="user in userStore.filteredUsers" :key="user._id"
            class="flex items-center justify-between gap-4 p-2 bg-gray-700 rounded-lg mb-2 hover:bg-gray-600 transition">
            <div class="flex items-center gap-4">
              <img :src="user.profilePicture || '/default-avatar.png'" alt="User Avatar"
                class="w-12 h-12 rounded-full object-cover" />
              <span class="text-white">{{ user.name }}</span>
            </div>

            <!-- Follow/Unfollow Button -->
            <button v-if="userStore.following" @click="toggleFollow(user)"
              class="text-sm font-medium py-2 px-4 rounded-lg transition"
              :class="isFollowing(user) ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-yellow-500 text-black hover:bg-yellow-400'">
              {{ isFollowing(user) ? 'Unfollow' : 'Follow' }}
            </button>
          </li>
        </ul>

        <!-- Close Button -->
        <button @click="userStore.showSearchModal = false"
          class="mt-4 bg-yellow-500 text-black py-2 px-4 rounded-lg font-medium hover:bg-yellow-400 transition">
          Close
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/userStore';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter();
    const route = useRoute(); // Get current route
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const userId = localStorage.getItem('userId');

    const logout = () => {
      authStore.logout();
      router.push({ name: 'LogIn' });
    };

    const isMobileMenuOpen = ref(false);
    const isNavbarHidden = ref(false);

    let lastScrollTop = 0;
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const isFollowing = (user) => userStore.following.includes(user._id);

    const toggleFollow = async (user) => {
      if (isFollowing(user)) {
        await userStore.unfollowUser(user._id);
      } else {
        console.log('Following user:', user._id);
        await userStore.followUser(user._id);
      }
    };


    const handleScroll = () => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        isNavbarHidden.value = true;
      } else {
        // Scrolling up
        isNavbarHidden.value = false;
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative scrolling
    };

    onMounted(async () => {
      // Fetch the user and their following data on mount
      await userStore.fetchUser(userId);
      await userStore.fetchUsers();
      await userStore.fetchFollowing(userId);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    // if (!userStore.user._id) {
    userStore.fetchUser(userId);
    // }

    // Check if the current route is the Profile page
    const isProfilePage = computed(() => route.name === 'Profile');

    const toggleSearchModal = () => {
      userStore.showSearchModal = !userStore.showSearchModal;
    };

    return {
      logout,
      userId,
      userStore,
      isMobileMenuOpen,
      toggleMobileMenu,
      isNavbarHidden,
      isProfilePage,
      isFollowing,
      toggleFollow,
      toggleSearchModal,
    };
  },
};
</script>

<style scoped>
header {
  width: 100%;
  background-color: transparent;
}

button:focus {
  outline: none;
}

a.active {
  background: #FFD700;
  border-radius: 2px;
}

.md\\:hidden .active {
  background: #FFD700;
  border-radius: 2px;
}

/* Remove hover effect from CineTrunk logo */
.no-hover:hover {
  background: none;
  border-radius: none;
}

/* Desktop Nav Links Hover Effects */
a:hover {
  background: #FFD700;
  border-radius: 2px;
}

/* Mobile Menu Adjustments */
.md\\:hidden {
  display: none;
}

.md\\:flex {
  display: flex;
}

/* Position and spacing of mobile menu below the logo */
.md\\:hidden {
  display: none;
}

button:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
}

/* Mobile Menu */
.md\\:hidden {
  display: none;
}

button.logout {
  display: block;
  width: 100%;
}

button.logout:hover {
  background-color: #FF0000;
}

.profile-link img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .flex.items-center.space-x-4 {
    justify-content: space-between;
  }

  button.logout {
    display: block;
    width: auto;
    margin-left: auto;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .profile-link {
    width: 40px;
    height: 40px;
  }

  /* Mobile Menu adjustments */
  .bg-gray-900 {
    position: relative;
    top: 0;
  }

  .px-4.pt-4.pb-2 {
    padding-top: 1rem;
    padding-bottom: 0.5rem;
  }

  .space-y-2>*+* {
    margin-top: 0.5rem;
  }
}
</style>