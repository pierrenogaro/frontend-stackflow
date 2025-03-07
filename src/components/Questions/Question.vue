<template>
  <div class="container-lg mb-5">
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
        <router-link
            v-if="isAuthenticated && question.author === currentUser" :to="`/question/edit/${question.id}`" class="btn btn-outline-warning btn-sm mt-2 me-2">✏️ Edit
        </router-link>

        <button
            v-if="isAuthenticated && question.author === currentUser"
            @click="deleteQuestion(question.id)"
            class="btn btn-outline-danger btn-sm mt-2 me-2">
          🗑 Delete
        </button>
      </div>

      <hr class="border-warning">
      <div v-if="answers.length > 0" class="mt-4">
        <h3 class="text-warning fw-bold">💬 Answers :</h3>
        <div class="answer-container border-warning shadow-lg p-3 rounded" style="max-height: 300px; overflow-y: auto;">
          <ul class="list-group">
            <li v-for="answer in answers" :key="answer.id" class="list-group-item bg-dark text-light border-warning mb-2">
              <p class="mb-2 fs-5">🗨️ {{ answer.content || "No message" }}</p>
              <p>Author: <strong>{{ answer.author || "Unknown author" }}</strong></p>
              <p class="small">📅 {{ formatDate(answer.date_created) }}</p>
              <div>
                <div>
                  <router-link :to="`/answers/${answer.id}/edit`" class="btn btn-outline-warning btn-sm me-2">
                    ✏️ Edit
                  </router-link>
                  <button v-if="isAuthenticated && answer.author === currentUser" @click="deleteAnswer(answer.id)" class="btn btn-outline-danger btn-sm me-2">
                    🗑 Delete
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="alert alert-warning text-center mt-4">No answers for this question.</div>

      <div v-if="isAuthenticated" class="mt-4">
        <h3 class="text-warning">Add an answer:</h3>
        <form @submit.prevent="submitAnswer">
          <div class="mb-3">
            <textarea v-model="newAnswer" class="form-control bg-dark text-light border-warning" rows="3" placeholder="Write your answer..."></textarea>
          </div>
          <button type="submit" class="btn btn-warning w-100">Send</button>
        </form>
      </div>

      <hr class="border-warning mt-4">

      <div v-if="comments.length > 0" class="mt-4">
        <h3 class="text-warning fw-bold">💭 Comments :</h3>
        <div class="comment-container border-warning shadow-lg p-3 rounded" style="max-height: 300px; overflow-y: auto;">
          <ul class="list-group">
            <li v-for="comment in comments" :key="comment.id" class="list-group-item bg-dark text-light border-warning mb-2">
              <p class="mb-2 fs-5">💬 {{ comment.content || "No comment" }}</p>
              <p>Author: <strong>{{ comment.author || "Unknown author" }}</strong></p>
              <p class="small">📅 {{ formatDate(comment.date_created) }}</p>
              <div>
                <div>
                  <router-link :to="`/comments/${comment.id}/edit`" class="btn btn-outline-warning btn-sm me-2">
                    ✏️ Edit
                  </router-link>
                  <button v-if="isAuthenticated && comment.author === currentUser" @click="deleteComment(comment.id)" class="btn btn-outline-danger btn-sm">
                    🗑 Delete
                  </button>
                </div>

              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="alert alert-warning text-center mt-4">No comments for this question.</div>

      <div v-if="isAuthenticated" class="mt-4">
        <h3 class="text-warning">Add a comment:</h3>
        <form @submit.prevent="submitComment">
          <div class="mb-3">
            <textarea v-model="newComment" class="form-control bg-dark text-light border-warning" rows="3" placeholder="Write your comment..."></textarea>
          </div>
          <button type="submit" class="btn btn-warning w-100">Comment</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import {useAuth} from "@/composables/useAuth.js";

const route = useRoute();
const question = ref(null);
const answers = ref([]);
const comments = ref([]);
const newAnswer = ref("");
const newComment = ref("");
const loading = ref(true);
const error = ref(null);
const { user: currentUser, isAuthenticated } = useAuth();


const fetchQuestion = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`http://127.0.0.1:8000/questions/${route.params.id}/?t=${new Date().getTime()}`);
    question.value = response.data.question;
    answers.value = response.data.answers;
    comments.value = response.data.comments;
  } catch (err) {
    error.value = "Error loading the question.";
  } finally {
    loading.value = false;
  }
};

const submitAnswer = async () => {
  if (!newAnswer.value.trim()) return;

  const token = localStorage.getItem("access");
  if (!token) {
    alert("You must be logged in to post an answer.");
    return;
  }

  try {
    await axios.post(
        `http://127.0.0.1:8000/questions/${route.params.id}/answers/`,
        { content: newAnswer.value },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    newAnswer.value = "";
    await fetchQuestion();
  } catch (err) {
    alert("Failed to add the answer.");
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;

  const token = localStorage.getItem("access");
  if (!token) {
    alert("You must be logged in to post a comment.");
    return;
  }

  try {
    await axios.post(
        `http://127.0.0.1:8000/questions/${route.params.id}/comments/`,
        { content: newComment.value },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    newComment.value = "";
    await fetchQuestion();
  } catch (err) {
    alert("Failed to add the comment.");
  }
};

const deleteAnswer = async (id) => {
  const token = localStorage.getItem("access");
  if (!token) {
    alert("You must be logged in to delete an answer.");
    return;
  }

  if (!confirm("Are you sure you want to delete this answer?")) return;

  try {
    await axios.delete(`http://localhost:8000/answer/delete/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchQuestion();
  } catch (err) {
    alert("Failed to delete the answer.");
  }
};

const deleteComment = async (id) => {
  const token = localStorage.getItem("access");
  if (!token) {
    alert("You must be logged in to delete a comment.");
    return;
  }

  if (!confirm("Are you sure you want to delete this comment?")) return;

  try {
    await axios.delete(`http://localhost:8000/comments/delete/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchQuestion();
  } catch (err) {
    alert("Failed to delete the comment.");
  }
};

watchEffect(() => {
  fetchQuestion();
});

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(fetchQuestion);
</script>

<style scoped>
.container-lg {
  max-width: 1200px;
  margin-top: 100px;
}
.card {
  border-radius: 15px;
}
.comment-container {
  background: rgba(255, 193, 7, 0.1);
  border-radius: 10px;
}

.answer-container {
  background: rgba(255, 193, 7, 0.1);
  border-radius: 10px;
}

.text-warning {
  color: #f8d210 !important;
}
</style>