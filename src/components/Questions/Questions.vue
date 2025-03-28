<template>
  <div class="container-lg mb-5">
    <h1 class="text-center display-3 fw-bold text-warning">📜 List of Questions</h1>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <div v-else class="card bg-dark text-light border-warning shadow-lg p-4">
      <div class="card-body">
        <h1 class="text-warning fw-bold">📌 Questions</h1>
        <div class="question-container border-warning shadow-lg p-3 rounded" style="max-height: 500px; overflow-y: auto;">
          <ul class="list-group">
            <li v-for="question in questions" :key="question.id" class="list-group-item bg-dark text-light border-warning mb-2">
              <h3 class="h5 fw-bold text-warning">📌 {{ question.title }}</h3>
              <p class="mb-2 fs-5">📝 {{ question.question }}</p>
              <p>🤵‍♂️ {{ question.author }}</p>
              <router-link :to="`/question/${question.id}`" class="btn btn-outline-warning btn-sm mt-2 me-2">
                🔍 View Question
              </router-link>
              <button @click="addToFavorites(question)" class="btn btn-outline-info btn-sm mt-2">
                ❤️ Add Favorite
              </button>
            </li>
          </ul>
        </div>
      </div>

      <hr class="border-warning">

      <div v-if="isAuthenticated" class="mt-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuth } from "@/composables/useAuth";

const { user: currentUser, isAuthenticated } = useAuth();
const questions = ref([]);
const loading = ref(false);
const error = ref(null);
const newQuestion = ref({ title: '', question: '' });

const fetchQuestions = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('https://stackflow.pierrenogaro.com/questions/');
    questions.value = response.data;
  } catch (err) {
    error.value = 'Error loading questions';
  } finally {
    loading.value = false;
  }
};

const postQuestion = async () => {
  if (!isAuthenticated.value) {
    alert("You must be logged in to post a question.");
    return;
  }

  try {
    await axios.post(
        'https://stackflow.pierrenogaro.com/questions/create/',
        newQuestion.value,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access')}`, "Content-Type": "application/json" } }
    );
    newQuestion.value = { title: '', question: '' };
    await fetchQuestions();
  } catch (err) {
    alert("Failed to post the question. Check your authentication.");
  }
};

const deleteQuestion = async (id) => {
  if (!isAuthenticated.value) {
    alert("You must be logged in to delete a question.");
    return;
  }

  if (!confirm("Are you sure you want to delete this question?")) return;

  try {
    await axios.delete(`https://stackflow.pierrenogaro.com/questions/delete/${id}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    });
    questions.value = questions.value.filter(q => q.id !== id);
  } catch (err) {
    alert("Failed to delete the question.");
  }
};

const addToFavorites = (question) => {
  if (!isAuthenticated.value) {
    alert("You must be logged in to add favorites.");
    return;
  }

  const userFavoritesKey = `userFavorites_${currentUser.value}`;
  let favorites = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];

  const isAlreadyFavorite = favorites.some(fav => fav.id === question.id);

  if (isAlreadyFavorite) {
    alert("This question is already in your favorites.");
    return;
  }

  favorites.push({
    id: question.id,
    title: question.title,
    author: question.author
  });

  localStorage.setItem(userFavoritesKey, JSON.stringify(favorites));

  const userProfileKey = `userProfile_${currentUser.value}`;
  const userProfile = JSON.parse(localStorage.getItem(userProfileKey)) || {};
  userProfile.favorite_count = favorites.length;
  localStorage.setItem(userProfileKey, JSON.stringify(userProfile));

  alert("Question added to favorites!");
}
onMounted(fetchQuestions);
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

.question-container {
  background: rgba(255, 193, 7, 0.1);
  border-radius: 10px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
}

.text-warning {
  color: #f8d210 !important;
}

.bg-dark {
  background-color: #212529 !important;
}
</style>