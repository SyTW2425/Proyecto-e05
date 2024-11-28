<template>
  <header class="w-full px-4 lg:px-16 h-12 flex items-center relative z-10">
    <nav class="flex space-x-4 mt-7">
      <!-- Router Links -->
      <router-link to="/home"
        class="text-white px-4 py-2 text-sm lg:text-base rounded hover:bg-yellow-500 transition duration-200 active:bg-yellow-500">
        Home
      </router-link>
      <router-link to="/films"
        class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded hover:bg-yellow-500 transition duration-200">
        Films
      </router-link>
      <router-link to="/activity"
        class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded hover:bg-yellow-500 transition duration-200">
        My Activity
      </router-link>
      <router-link to="/lists"
        class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded hover:bg-yellow-500 transition duration-200">
        My Lists
      </router-link>

      <!-- Profile image and Log out -->
      <div class="absolute right-4 top-4 flex items-center space-x-4">
        <img src="../../public/default-profile.png" alt="Profile Picture"
          class="w-10 h-10 rounded-full border-2 border-yellow-500 object-cover" />

        <button @click="logout"
          class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded bg-red-500 hover:bg-red-400 transition duration-200">
          Log Out
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const logout = () => {
      authStore.logout();
      router.push({ name: 'LogIn' });
    };

    return {
      logout,
    };
  },
};
</script>

<style scoped>
header {
  position: absolute;
  top: 0;
  width: 100%;
  background: transparent;
  z-index: 1000;
}

header nav a {
  color: #fff;
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-family: 'Poppins';
  transition: 0.2s;
  text-decoration: none;
}

a.active {
  background: #FFD700;
  border-radius: 2px;
}

a:hover {
  background: #FFD700;
  border-radius: 2px;
}

button:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
}
</style>
