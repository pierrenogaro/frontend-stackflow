import { ref, computed, watchEffect } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const user = ref(localStorage.getItem("user") || null);
const token = ref(localStorage.getItem("access") || null);
const error = ref(null);
const isAuthenticated = computed(() => !!token.value);

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await axios.post(
                    "https://stackflow.pierrenogaro.com/token/refresh/",
                    { refresh: refreshToken }
                );

                const newAccessToken = response.data.access;
                localStorage.setItem("access", newAccessToken);
                axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return axios(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export function useAuth() {
    const router = useRouter();

    watchEffect(() => {
        user.value = localStorage.getItem("user") || null;
    });

    const register = async (username, password) => {
        error.value = null;
        try {
            await axios.post("https://stackflow.pierrenogaro.com/register/", { username, password });
            return true;
        } catch (err) {
            error.value = err.response?.data?.error || "Registration error";
            return false;
        }
    };

    const login = async (username, password) => {
        error.value = null;
        try {
            const response = await axios.post("https://stackflow.pierrenogaro.com/login/", { username, password });

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

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) throw new Error("No refresh token");

            const response = await axios.post(
                "https://stackflow.pierrenogaro.com/token/refresh/",
                { refresh: refreshToken }
            );

            token.value = response.data.access;
            localStorage.setItem("access", response.data.access);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
            return true;
        } catch (err) {
            error.value = "Session expired. Please login again.";
            return false;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh");
            if (refreshToken) {
                await axios.post("https://stackflow.pierrenogaro.com/logout/", { refresh: refreshToken });
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
        refreshToken
    };
}
