import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LogIn from '../views/LogIn.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
