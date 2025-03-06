import { ref, computed, watchEffect } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const user = ref(localStorage.getItem("user") || null);
const token = ref(localStorage.getItem("access") || null);
const error = ref(null);
const isAuthenticated = computed(() => !!token.value);

export function useAuth() {
    const router = useRouter();

    watchEffect(() => {
        user.value = localStorage.getItem("user") || null;
    });

    const register = async (username, password) => {
        error.value = null;
        try {
            await axios.post("http://localhost:8000/register/", { username, password });
            return true;
        } catch (err) {
            error.value = err.response?.data?.error || "Registration error";
            return false;
        }
    };

    const login = async (username, password) => {
        error.value = null;
        try {
            const response = await axios.post("http://localhost:8000/login/", { username, password });

            token.value = response.data.access;
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            localStorage.setItem("user", username);

            user.value = username;
            axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

            return true;
        } catch (err) {
            error.value = err.response?.data?.error || "Incorrect credentials";
            return false;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh");
            if (refreshToken) {
                await axios.post("http://localhost:8000/logout/", { refresh: refreshToken });
            }
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];
            router.push("/login");
        }
    };

    return {
        user,
        token,
        error,
        isAuthenticated,
        register,
        login,
        logout,
    };
}
