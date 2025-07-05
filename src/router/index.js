import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import ForgotPasswordPage from '@/views/ForgotPasswordPage.vue'
import MFAVerificationPage from '@/views/MFAVerificationPage.vue'
import VerifyEmailPage from '@/views/VerifyEmailPage.vue'
import SetupMFAPage from '@/views/SetupMFAPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordPage,
    },
    {
      path: '/mfa-verification',
      name: 'mfa-verification',
      component: MFAVerificationPage,
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: VerifyEmailPage,
    },
    {
      path: '/setup-mfa',
      name: 'setup-mfa',
      component: SetupMFAPage,
    },
  ],
})

export default router
