<template>
<div class="login-container">
<div class="card bg-dark text-light border-warning shadow-lg p-4">
  <h1 class="fw-bold text-warning text-center login-title">🔐 Login</h1>
  <p class="text-center subtitle">Log in to access account STACKFLOW!</p>

  <form @submit.prevent="handleLogin" class="mt-4">
    <div class="mb-4">
      <input
          v-model="username"
          type="text"
          class="form-control bg-dark text-light border-warning input-field"
          placeholder="👤 Username"
          required
      />
    </div>
    <div class="mb-4">
      <input
          v-model="password"
          type="password"
          class="form-control bg-dark text-light border-warning input-field"
          placeholder="🔑 Password"
          required
      />
    </div>
    <button type="submit" class="btn btn-warning w-100 fw-bold login-btn">🚀 Log in</button>
  </form>

  <p v-if="error" class="text-danger text-center mt-4 error-message">{{ error }}</p>
</div>
</div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const { login, error } = useAuth();
const router = useRouter();

const username = ref("");
const password = ref("");

const handleLogin = async () => {
  const success = await login(username.value, password.value);
  if (success) {
    router.push("/dashboard");
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
}

.card {
  width: 500px;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  background: #212529;
  box-shadow: 0px 8px 20px rgba(248, 210, 16, 0.5);
  border-width: 3px;
}

.login-title {
  font-size: 3.5rem;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 1.4rem;
  margin-top: 15px;
  margin-bottom: 25px;
}

.input-field {
  border-radius: 15px;
  padding: 16px;
  font-size: 1.2rem;
  margin-bottom: 15px;
  border-width: 2px;
  height: 60px;
}

.login-btn {
  background-color: #f8d210;
  border: none;
  transition: all 0.3s ease-in-out;
  font-size: 1.4rem;
  padding: 15px;
  border-radius: 15px;
  height: 60px;
  letter-spacing: 1px;
}

.login-btn:hover {
  background-color: #ffbe0b;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(248, 210, 16, 0.4);
}

.error-message {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
}
</style>