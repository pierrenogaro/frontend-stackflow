<template>
  <div class="dashboard-container">
    <div class="card bg-dark text-light border-warning shadow-lg p-4 text-center">
      <h1 class="fw-bold text-warning welcome-title">👋 Welcome, {{ username }}!</h1>
      <p class="subtitle">Happy to see you back on STACKFLOW!</p>

      <button class="btn btn-danger mt-4 fw-bold logout-btn" @click="handleLogout">
        🚪 Log out
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const { logout, user } = useAuth();
const router = useRouter();

const username = computed(() => user.value || "Guest");

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
}

.card {
  width: 600px;
  border-radius: 20px;
  padding: 50px;
  text-align: center;
  background: #212529;
  box-shadow: 0px 8px 20px rgba(248, 210, 16, 0.5);
  border-width: 3px;
}

.welcome-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 1.6rem;
  margin-top: 15px;
  margin-bottom: 30px;
}

.logout-btn {
  background-color: #dc3545;
  border: none;
  transition: all 0.3s ease-in-out;
  font-size: 1.4rem;
  padding: 15px 30px;
  border-radius: 15px;
  letter-spacing: 1px;
}

.logout-btn:hover {
  background-color: #c82333;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
}
</style>