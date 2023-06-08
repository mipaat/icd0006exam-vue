import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/identity/LoginView.vue';
import RegisterView from '../views/identity/RegisterView.vue';
import AccessDeniedView from '../views/ForbidView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import ErrorView from '../views/ErrorView.vue';
import ManageUsersView from '../views/admin/ManageUsersView.vue';
import { adminNavigationGuard } from './identityRedirects';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/identity/account/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/identity/account/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/accessDenied',
            name: 'accessDenied',
            component: AccessDeniedView,
        },
        {
            path: '/error',
            name: 'error',
            component: ErrorView,
        },
        {
            path: '/notFound',
            name: 'notFound',
            component: NotFoundView,
        },
        {
            path: '/admin',
            name: 'admin',
            beforeEnter: adminNavigationGuard,
            children: [
                {
                    path: 'manageUsers',
                    name: 'manageUsers',
                    component: ManageUsersView,
                }
            ]
        },
        {
            path: '/:catchAll(.*)*',
            name: 'defaultNotFound',
            component: NotFoundView,
        }
    ]
});

export default router;
