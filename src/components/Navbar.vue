<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold text-warning" to="/">STACKFLOW</RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/home">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/favorite">Favorite</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/questions">Questions</RouterLink>
          </li>
        </ul>

        <div v-if="isAuthenticated">
          <span class="navbar-text text-warning fw-bold me-3">👤 {{ username }}</span>
          <button class="btn btn-danger" @click="handleLogout">Logout</button>
        </div>

        <div v-else>
          <RouterLink class="btn btn-primary ms-3" to="/login">Login</RouterLink>
          <RouterLink class="btn btn-danger ms-3" to="/register">Register</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "@/composables/useAuth";

const { logout, user, isAuthenticated } = useAuth();

const username = computed(() => user.value || "Invité");

const handleLogout = () => {
  logout();
};
</script>



<style scoped>
.navbar-nav .nav-link {
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
}

.navbar-nav .nav-link:hover {
  color: #f8d210 !important;
}

.navbar-brand {
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.btn-primary {
  background-color: #f8d210;
  border-color: #f8d210;
  color: #000;
}

.btn-primary:hover {
  background-color: #ffbe0b;
  border-color: #ffbe0b;
}
</style>
