import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/identity/LoginView.vue';
import RegisterView from '../views/identity/RegisterView.vue';
import AccessDeniedView from '../views/ForbidView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import ErrorView from '../views/ErrorView.vue';
import ManageUsersView from '../views/admin/ManageUsersView.vue';
import ProductsIndexView from '../views/products/ProductsIndex.vue';
import ProductCreate from '../views/products/ProductCreate.vue';
import ProductDetails from '../views/products/ProductDetails.vue';
import ProductDelete from '../views/products/ProductDelete.vue';
import ProductEdit from '../views/products/ProductEdit.vue';
import ExistenceCreate from '../views/productExistences/ExistenceCreate.vue';
import ExistenceEdit from '../views/productExistences/ExistenceEdit.vue';
import RecipesIndex from '../views/recipes/RecipesIndex.vue';
import RecipeCreate from '../views/recipes/RecipeCreate.vue';
import RecipeEdit from '../views/recipes/RecipeEdit.vue';
import RecipeDelete from '../views/recipes/RecipeDelete.vue';
import { adminNavigationGuard, loginNavigationGuard } from './identityRedirects';

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
            path: '/recipes',
            children: [
                {
                    path: '',
                    name: 'recipes',
                    component: RecipesIndex,
                },
                {
                    path: 'create',
                    name: 'recipeCreate',
                    component: RecipeCreate,
                },
                {
                    path: 'edit',
                    name: 'recipeEdit',
                    component: RecipeEdit,
                },
                {
                    path: 'delete',
                    name: 'recipeDelete',
                    component: RecipeDelete,
                },
            ]
        },
        {
            path: '/products',
            children: [
                {
                    path: '',
                    name: 'products',
                    component: ProductsIndexView
                },
                {
                    path: 'create',
                    name: 'productCreate',
                    component: ProductCreate,
                    beforeEnter: adminNavigationGuard,
                },
                {
                    path: 'details',
                    name: 'productDetails',
                    component: ProductDetails,
                },
                {
                    path: 'delete',
                    name: 'productDelete',
                    beforeEnter: adminNavigationGuard,
                    component: ProductDelete,
                },
                {
                    path: 'edit',
                    name: 'productEdit',
                    beforeEnter: adminNavigationGuard,
                    component: ProductEdit,
                },
            ]
        },
        {
            path: '/productExistences',
            beforeEnter: loginNavigationGuard,
            children: [
                {
                    path: 'create',
                    name: 'existenceCreate',
                    component: ExistenceCreate,
                },
                {
                    path: 'edit',
                    name: 'existenceEdit',
                    component: ExistenceEdit,
                },
            ]
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
