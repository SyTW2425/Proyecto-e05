<template>
  <div class="bg-custom-background font-[poppins] min-h-screen">
    <div class="grid md:grid-cols-2 items-center min-h-full">
      <!-- Left section -->
      <div class="relative h-screen w-full">
        <img src="../assets/image/films.svg" class="absolute inset-0 w-full h-full object-cover" alt="register-image" />
      </div>

      <!-- Right section -->
      <div class="flex-grow flex items-center md:p-8 p-6 h-full">
        <form class="max-w-lg w-full mx-auto">
          <div class="mb-2">
            <h3 class="text-yellow-500 text-center text-4xl font-extrabold">Sign Up</h3>
          </div>

          <div>
            <label class="text-white text-xs block mb-1">Full name</label>
            <div class="relative flex items-center">
              <input v-model="name" name="full-name" type="text" required
                class="w-full text-sm border-b rounded-md border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 px-2 py-3"
                placeholder="Introduce your full name" />
            </div>
          </div>

          <div class="mt-8">
            <label class="text-white text-xs block mb-1">Username</label>
            <div class="relative flex items-center">
              <input v-model="username" name="email" type="email" required
                class="w-full text-sm border-b rounded-md border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 px-2 py-3"
                placeholder="Introduce your username" />
            </div>
          </div>


          <div class="mt-8">
            <label class="text-white text-xs block mb-1">Email</label>
            <div class="relative flex items-center">
              <input v-model="email" name="email" type="email" required
                class="w-full text-sm border-b rounded-md border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 px-2 py-3"
                placeholder="Introduce your email" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
                class="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                <path fill="none" stroke-miterlimit="10" stroke-width="40"
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z">
                </path>
              </svg>
            </div>
          </div>

          <div class="mt-8">
            <label class="text-white text-xs block mb-1">Password</label>
            <div class="relative flex items-center">
              <input v-model="password" name="password" type="password" required
                class="w-full text-sm border-b rounded-md border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 px-2 py-3"
                placeholder="Introduce your password" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
                class="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                <path
                  d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z">
                </path>
              </svg>
            </div>
          </div>

          <div class="mt-8">
            <label class="text-white text-xs block mb-1">Password</label>
            <div class="relative flex items-center">
              <input v-model="confirmPassword" name="confirm-password" type="password" required
                class="w-full text-sm border-b rounded-md border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 px-2 py-3"
                placeholder="Confirm your password" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
                class="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                <path
                  d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z">
                </path>
              </svg>
            </div>
          </div>


          <div class="mt-12">
            <button type="button" @click="handleSubmit"
              class="w-full py-3 px-6 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-yellow-500 focus:outline-none">
              Sign Up
            </button>
          </div>
          
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAlertStore } from '../stores/alert';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const authStore = useAuthStore();
const alertStore = useAlertStore();
const router = useRouter();

// Validation schema
const schema = yup.object({
  name: yup.string().required('Full name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

// Form state
const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeTerms = ref(false);

const handleSubmit = async () => {
  const values = {
    name: name.value,
    username: username.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  };

  try {
    await schema.validate(values, { abortEarly: false });

    if (await authStore.register(name.value, username.value, email.value, password.value) === true) {
      // Redirect to the login page after successful registration
      router.push('/login');
    }

  } catch (err) {
    if (err.name === 'ValidationError') {
      alertStore.error(err.errors.join(', '));
    } else {
      alertStore.error('An unexpected error occurred.');
    }
  }
};
</script>



<style scoped>
.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}

/* Tooltip styling */
.tooltip {
  position: relative;
}

.tooltip:hover::after,
.tooltip:focus::after {
  content: 'Click the link to view full terms.';
  position: absolute;
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  top: -35px;
  left: 0;
  white-space: nowrap;
  font-size: 12px;
  z-index: 10;
}

.tooltip:hover::before,
.tooltip:focus::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #333 transparent;
  z-index: 10;
}
</style>