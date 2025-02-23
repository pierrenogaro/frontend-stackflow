<template>
  <div class="container-lg mt-5">
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <div v-else-if="question" class="card bg-dark text-light border-warning shadow-lg p-4">
      <div class="card-body">
        <h1 class="card-title text-warning fw-bold">📌 {{ question.title }}</h1>
        <h2 class="card-text fs-5">📝 {{ question.question }}</h2>
        <h5>🤵‍♂️ {{ question.author }}</h5>
      </div>

      <hr class="border-warning">
      <div v-if="answers.length > 0" class="mt-4">
        <h3 class="text-warning fw-bold">💬 Answers:</h3>
        <div class="answer-container border-warning shadow-lg p-3 rounded" style="max-height: 300px; overflow-y: auto;">
          <ul class="list-group">
            <li v-for="answer in answers" :key="answer.id" class="list-group-item bg-dark text-light border-warning mb-2">
              <p class="mb-2 fs-5">🗨️ {{ answer.content }}</p>
              <p>Author: <strong>{{ answer.author }}</strong></p>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="alert alert-warning text-center mt-4">No answers for this question.</div>

      <div class="mt-4">
        <h3 class="text-warning">Add an answer:</h3>
        <form @submit.prevent="submitAnswer">
          <div class="mb-3">
            <textarea v-model="newAnswer" class="form-control bg-dark text-light border-warning" rows="3" placeholder="Write your answer..."></textarea>
          </div>
          <button type="submit" class="btn btn-warning w-100">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const question = ref(null);
const answers = ref([]);
const newAnswer = ref("");
const loading = ref(true);
const error = ref(null);

const fetchQuestion = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`http://localhost:8000/questions/${route.params.id}/`);
    question.value = response.data.question;
    answers.value = response.data.answers;
  } catch (err) {
    error.value = "Error loading the question.";
  } finally {
    loading.value = false;
  }
};

const submitAnswer = async () => {
  if (!newAnswer.value.trim()) return;
  try {
    const response = await axios.post(`http://localhost:8000/questions/${route.params.id}/answers/`, {
      content: newAnswer.value,
    });
    answers.value.push(response.data);
    newAnswer.value = "";
  } catch (err) {
    console.error("Error adding the answer", err);
  }
};

onMounted(fetchQuestion);
</script>

<style scoped>
.container-lg {
  max-width: 1200px;
  margin: auto;
}

.card {
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0px 4px 10px rgba(248, 210, 16, 0.5);
}

.answer-container {
  background: rgba(255, 193, 7, 0.1);
  border-radius: 10px;
}

.text-warning {
  color: #f8d210 !important;
}
</style>
