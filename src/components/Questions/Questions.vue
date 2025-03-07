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

        <router-link :to="`/question/${question.id}`" class="btn btn-outline-warning btn-sm mt-2 me-2">
          🔍 View Question
        </router-link>
        <button @click="deleteQuestion(question.id)" class="btn btn-outline-danger btn-sm mt-2">
          🗑 Delete
        </button>
      </li>
    </ul>

    <div class="mt-5 p-4 bg-dark text-light border-warning shadow rounded">
      <h2 class="text-warning">📝 Post a Question</h2>
      <form @submit.prevent="postQuestion">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input type="text" id="title" v-model="newQuestion.title" class="form-control bg-dark text-light border-warning" required>
        </div>
        <div class="mb-3">
          <label for="question" class="form-label">Question</label>
          <textarea id="question" v-model="newQuestion.question" class="form-control bg-dark text-light border-warning" rows="4" required></textarea>
        </div>
        <button type="submit" class="btn btn-warning w-100">Submit</button>
      </form>
    </div>
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
const newQuestion = ref({ title: '', question: '' });

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

const postQuestion = async () => {
  const token = localStorage.getItem("access");
  if (!token) {
    alert("You must be logged in to post a question.");
    return;
  }

  try {
    await axios.post(
        'http://localhost:8000/questions/create/',
        newQuestion.value,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    newQuestion.value = { title: '', question: '' };
    await fetchQuestions();
  } catch (err) {
    alert("Failed to post the question. Check your authentication.");
  }
};

const deleteQuestion = async (id) => {
  const token = localStorage.getItem("access");
  if (!token) {
    alert("You must be logged in to delete a question.");
    return;
  }

  if (!confirm("Are you sure you want to delete this question?")) return;

  try {
    await axios.delete(`http://localhost:8000/questions/delete/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    questions.value = questions.value.filter(q => q.id !== id);
  } catch (err) {
    alert("Failed to delete the question.");
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

.bg-dark {
  background-color: #212529 !important;
}
</style>
