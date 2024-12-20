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

          <div class="my-6 flex items-center gap-4">
            <hr class="w-full border-gray-300" />
            <p class="text-sm text-white text-center">or</p>
            <hr class="w-full border-gray-300" />
          </div>

          <button type="button"
            class="w-full flex items-center justify-center gap-4 py-3 px-6 text-sm font-semibold tracking-wider text-gray-800 border border-gray-300 rounded-full bg-gray-50 hover:bg-yellow-500 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" class="inline" viewBox="0 0 512 512">
              <path fill="#fbbd00"
                d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                data-original="#fbbd00" />
              <path fill="#0f9d58"
                d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                data-original="#0f9d58" />
              <path fill="#31aa52"
                d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                data-original="#31aa52" />
              <path fill="#3c79e6"
                d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                data-original="#3c79e6" />
              <path fill="#cf2d48"
                d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                data-original="#cf2d48" />
              <path fill="#eb4132"
                d="M256 120V0C187.62 0 123.333 26.629 74.98 68.255l-10.606 10.606 60 60C179.347 118.13 219.347 120 256 120z"
                data-original="#eb4132" />
            </svg>
            <span>Sign up with google</span>
          </button>
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

    // Call the register action
    await authStore.register(name.value, username.value, email.value, password.value);

    // Redirect to the login page after successful registration
    router.push('/login');
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