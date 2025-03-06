<template>
  <div class="register-container">
    <div class="card bg-dark text-light border-warning shadow-lg p-4">
      <h1 class="fw-bold text-warning text-center register-title">📝 Register</h1>
      <p class="text-center subtitle">Create an account to join STACKFLOW!</p>

      <form @submit.prevent="handleRegister" class="mt-4">
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
        <button type="submit" class="btn btn-warning w-100 fw-bold register-btn">✅ Register</button>
      </form>

      <p v-if="error" class="text-danger text-center mt-4 error-message">{{ error }}</p>

      <p class="text-center mt-4 login-link">
        Already have an account?
        <RouterLink to="/login" class="text-warning fw-bold">Login</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const { register, error } = useAuth();
const router = useRouter();

const username = ref("");
const password = ref("");

const handleRegister = async () => {
  const success = await register(username.value, password.value);
  if (success) {
    router.push("/login");
  }
};
</script>

<style scoped>
.register-container {
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

.register-title {
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

.register-btn {
  background-color: #f8d210;
  border: none;
  transition: all 0.3s ease-in-out;
  font-size: 1.4rem;
  padding: 15px;
  border-radius: 15px;
  height: 60px;
  letter-spacing: 1px;
}

.register-btn:hover {
  background-color: #ffbe0b;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(248, 210, 16, 0.4);
}

.error-message {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
}

.login-link {
  font-size: 1.2rem;
  margin-top: 25px;
}

.text-warning:hover {
  text-decoration: underline;
}
</style>