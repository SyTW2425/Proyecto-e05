import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Home from '../views/Home.vue';
import LogIn from '../views/LogIn.vue';
import Register from '../views/Register.vue';
import Films from '../views/Films.vue';
import Profile from '../views/Profile.vue';
import NotFound from '../components/NotFound.vue';
import MovieDetail from '../components/MovieDetail.vue';

const routes = [
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
    path: '/',
    name: 'Home',
    component: Home, // Home page
    meta: { requiresAuth: true },
  },
  {
    path: '/films',
    name: 'Films',
    component: Films, // Films page
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile, // User Profile page
    meta: { requiresAuth: true },
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail, // MovieDetail component
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound, // 404 page
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
