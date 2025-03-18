import { createRouter, createWebHistory } from "vue-router";
import Questions from "@/components/Questions/Questions.vue";
import Question from "@/components/Questions/Question.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import { useAuth } from "@/composables/useAuth";
import Profile from "@/components/Profile/Profile.vue";
import QuestionEdit from "@/components/Questions/QuestionEdit.vue";
import CommentEdit from "@/components/Comments/CommentEdit.vue";
import AnswerEdit from "@/components/Answers/AnswerEdit.vue";
import ProfileEdit from "@/components/Profile/ProfileEdit.vue";

export const routes = [
    { path: "/questions", component: Questions },
    { path: "/question/:id", component: Question },
    { path: "/register", component: RegisterView },
    { path: "/login", component: LoginView },
    { path: "/profile", component: Profile, meta: { requiresAuth: true } },
    { path: "/profile/edit", component: ProfileEdit, meta: { requiresAuth: true } },
    { path: "/question/edit/:id", component: QuestionEdit,meta: { requiresAuth: true }},
    { path: "/comments/:id/edit", component: CommentEdit, meta: { requiresAuth: true } },
    { path: "/answers/:id/edit", component: AnswerEdit, meta: { requiresAuth: true } },
    { path: "/dashboard", component: DashboardView, meta: { requiresAuth: true }},
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
