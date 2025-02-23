<template>
  <div class="container mt-4">
    <h1 class="text-center display-4 mb-4">List of Questions</h1>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <ul v-else class="list-group">
      <li v-for="question in questions" :key="question.id" class="list-group-item bg-dark text-light border-warning">
        <h2 class="h5 fw-bold text-warning">{{ question.title }}</h2>
        <p class="mb-1">{{ question.question }}</p>
        <p class="text-white">Auteur : <strong>{{ question.author }}</strong></p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

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
    error.value = 'Erreur lors du chargement des questions';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchQuestions);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}

.list-group-item {
  background-color: #343a40;
  border-left: 4px solid #f8d210;
}

.text-warning {
  color: #f8d210 !important;
}
</style>
