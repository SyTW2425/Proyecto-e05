import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LogIn from '../views/LogIn.vue';
import Register from '../views/Register.vue';
import Films from '../views/Films.vue';
import Profile from '../views/Profile.vue';
import NotFound from '../components/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'LogIn',
    component: LogIn, // Login page
  },
  {
    path: '/home',
    name: 'Home',
    component: Home, // Home page
  },
  {
    path: '/register',
    name: 'Register',
    component: Register, // Register page
  },
  {
    path: '/films',
    name: 'Films',
    component: Films, // Films page
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile, // User Profile page
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound, // 404 page
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
