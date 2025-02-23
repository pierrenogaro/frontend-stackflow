<template>
  <div class="container mt-4">
    <h1 class="text-center display-4 mb-4 text-warning">Liste des Questions</h1>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Chargement...</span>
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

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questions: [],
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchQuestions() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:8000/questions/');
        this.questions = response.data;
      } catch (err) {
        this.error = 'Erreur lors du chargement des questions';
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.fetchQuestions();
  }
};
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