<template>
  <div class="container mt-5">
    <h1 class="text-center display-3 fw-bold text-warning">📜 List of Questions</h1>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <ul v-else class="list-group">
      <li v-for="question in questions" :key="question.id" class="list-group-item bg-dark text-light border-warning shadow-sm p-4">
        <h2 class="h5 fw-bold text-warning">📌 {{ question.title }}</h2>
        <p class="mb-2 fs-5">📝 {{ question.question }}</p>
        <p>🤵‍♂️ {{ question.author }}</p>

        <router-link :to="`/question/${question.id}`" class="btn btn-outline-warning btn-sm mt-2">
          🔍 View Question
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const questions = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchQuestions = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('http://localhost:8000/questions/');
    questions.value = response.data;
  } catch (err) {
    error.value = 'Error loading questions';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchQuestions);
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
}

.list-group-item {
  background-color: #343a40;
  border-left: 4px solid #f8d210;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 20px;
  transition: transform 0.2s ease-in-out;
}

.list-group-item:hover {
  transform: scale(1.02);
  box-shadow: 0px 4px 10px rgba(248, 210, 16, 0.5);
}

.text-warning {
  color: #f8d210 !important;
}
</style>
