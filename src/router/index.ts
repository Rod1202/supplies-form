import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';
import FormView from '../views/FormView.vue';
import SuccessView from '../views/SuccessView.vue';
import AdminView from '../views/AdminView.vue';
import ConfirmView from '../views/ConfirmView.vue';

const routes = [
  {
    path: '/',
    name: 'LoginView',
    component: LoginView,
  },
  {
    path: '/form',
    name: 'FormView',
    component: FormView,
  },
  {
    path: '/confirm',
    name: 'ConfirmView',
    component: ConfirmView,
    props: true,
  },
  {
    path: '/success',
    name: 'SuccessView',
    component: SuccessView,
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;  // Asegúrate de que esta línea esté presente y guardada