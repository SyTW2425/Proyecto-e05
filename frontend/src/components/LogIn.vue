<template>
  <div class="bg-custom-background font-[poppins] min-h-screen">
    <div class="grid md:grid-cols-2 items-center min-h-full">
      <!-- Left section -->
      <div class="relative h-screen w-full">
        <img src="../assets/image/films.svg" class="absolute inset-0 w-full h-full object-cover" alt="login-image" />
      </div>

      <!-- Right section -->
      <div class="flex-grow flex items-center md:p-8 p-6 h-full">
        <form class="max-w-lg w-full mx-auto" @submit.prevent="handleSubmit">

          <div class="mb-12">
            <h3 class="text-yellow-500 text-center text-4xl font-extrabold">Log In</h3>
          </div>

          <div>
            <label class="text-white text-xs block mb-2">Username</label>
            <div class="relative flex items-center">
              <input v-model="username" name="username" type="text" required
                class="w-full text-sm border-b rounded-md border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 px-2 py-3"
                placeholder="Introduce your username" />
            </div>
          </div>

          <div class="mt-8">
            <label class="text-white text-xs block mb-2">Password</label>
            <div class="relative flex items-center">
              <!-- Password input field -->
              <input v-model="password" name="password" :type="showPassword ? 'text' : 'password'" required
                class="w-full text-sm border-b rounded-md border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 px-2 py-3"
                placeholder="Introduce your password" />

              <!-- Show/Hide Password Icon -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" @click="togglePasswordVisibility" fill="#bbb"
                stroke="#bbb" class="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                <!-- Eye Closed Icon -->
                <path
                  d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z">
                </path>
              </svg>

              <svg v-else xmlns="http://www.w3.org/2000/svg" @click="togglePasswordVisibility" fill="#bbb" stroke="#bbb"
                class="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 576 512">
                <!-- Eye Open Icon -->
                <path
                  d="M572.52 241.4C518.29 135.6 400.26 64 288 64S57.71 135.6 3.48 241.4a48.11 48.11 0 0 0 0 29.2C57.71 376.4 175.74 448 288 448s230.29-71.6 284.52-177.4a48.11 48.11 0 0 0 0-29.2zM288 400c-70.69 0-128-57.31-128-128s57.31-128 128-128 128 57.31 128 128-57.31 128-128 128zm0-192a64 64 0 1 0 64 64 64.07 64.07 0 0 0-64-64z">
                </path>
              </svg>
            </div>
          </div>

          <div class="mt-12">
            <button type="submit"
              class="w-full py-3 px-6 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-yellow-500 focus:outline-none">
              Continue
            </button>
          </div>
          

          
          <p class="text-white text-sm mt-4">
            ¿No account yet?
            <router-link to="/register" class="text-yellow-500 font-semibold hover:underline ml-1 whitespace-nowrap">
              Register here
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  const isSuccess = await authStore.login(username.value, password.value);

  if (isSuccess) {
    router.push({ name: 'Home' });
  }
};


const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>


<style scoped>
.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}
</style>
