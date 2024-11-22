import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LogIn from '../views/LogIn.vue';
import Register from '../views/Register.vue';

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
    component: Register // Register page
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn, // Login page
  },
  {
    path: '/register',
    name: 'Register',
    component: Register // Register page
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
