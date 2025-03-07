<template>
  <div class="container-lg mb-5">
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <div v-else class="card bg-dark text-light border-warning shadow-lg p-4">
      <div class="card-body">
        <h1 class="text-warning fw-bold">✏️ Edit Question</h1>
        <form @submit.prevent="updateQuestion">
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input type="text" id="title" v-model="question.title" class="form-control bg-dark text-light border-warning" required>
          </div>
          <div class="mb-3">
            <label for="question" class="form-label">Question</label>
            <textarea id="question" v-model="question.question" class="form-control bg-dark text-light border-warning" rows="4" required></textarea>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-warning flex-grow-1">Update Question</button>
            <router-link :to="`/question/${questionId}`" class="btn btn-outline-warning flex-grow-1">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const questionId = route.params.id;
const { isAuthenticated } = useAuth();

const question = ref({ title: '', question: '' });
const loading = ref(true);
const error = ref(null);

const fetchQuestion = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`http://localhost:8000/questions/${questionId}/?t=${new Date().getTime()}`);
    question.value = {
      title: response.data.question.title,
      question: response.data.question.question
    };
  } catch (err) {
    error.value = "Error loading the question.";
  } finally {
    loading.value = false;
  }
};

const updateQuestion = async () => {
  if (!isAuthenticated.value) {
    alert("You must be logged in to edit a question.");
    return;
  }

  try {
    await axios.put(
        `http://localhost:8000/questions/update/${questionId}/`,
        question.value,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access')}`, "Content-Type": "application/json" } }
    );
    router.push(`/question/${questionId}`);
  } catch (err) {
    if (err.response && err.response.status === 403) {
      error.value = "You are not authorized to edit this question.";
    } else {
      error.value = "Failed to update the question.";
    }
  }
};

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  fetchQuestion();
});
</script>

<style scoped>
.container-lg {
  max-width: 1200px;
  margin-top: 100px;
}

.card {
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0px 4px 10px rgba(248, 210, 16, 0.5);
}

.text-warning {
  color: #f8d210 !important;
}

.bg-dark {
  background-color: #212529 !important;
}
</style>