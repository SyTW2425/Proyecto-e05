import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LogIn from '../views/LogIn.vue';
import Register from '../views/Register.vue';
import Search from '../views/Search.vue';
import Profile from '../views/Profile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // Home page
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn, // Login page
  },
  {
    path: '/register',
    name: 'Register',
    component: Register, // Register page
  },
  {
    path: '/search',
    name: 'Search',
    component: Search, // Search page
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile, // User Profile page
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
