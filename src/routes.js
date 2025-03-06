import { createRouter, createWebHistory } from "vue-router";
import Questions from "@/components/Questions/Questions.vue";
import Question from "@/components/Questions/Question.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import { useAuth } from "@/composables/useAuth";

export const routes = [
    { path: "/questions", component: Questions },
    { path: "/question/:id", component: Question },
    { path: "/register", component: RegisterView },
    { path: "/login", component: LoginView },
    {
        path: "/dashboard",
        component: DashboardView,
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const { isAuthenticated } = useAuth();
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        next("/login");
    } else {
        next();
    }
});

export default router;
