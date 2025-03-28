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
        <h1 class="text-warning fw-bold">✏️ Edit Comment</h1>
        <form @submit.prevent="updateComment">
          <div class="mb-3">
            <label for="comment" class="form-label">Comment</label>
            <textarea id="comment" v-model="comment.content" class="form-control bg-dark text-light border-warning" rows="4" required></textarea>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-warning flex-grow-1">Update Comment</button>
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
const commentId = route.params.id;
const { isAuthenticated } = useAuth();

const comment = ref({ content: '' });
const loading = ref(true);
const error = ref(null);
const questionId = ref(null);

const fetchComment = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`https://stackflow.pierrenogaro.com/comments/${commentId}/?t=${new Date().getTime()}`);
    comment.value = {
      content: response.data.content,
    };
    questionId.value = response.data.question;
  } catch (err) {
    error.value = "Error loading the comment.";
  } finally {
    loading.value = false;
  }
};

const updateComment = async () => {
  if (!isAuthenticated.value) {
    alert("You must be logged in to edit a comment.");
    return;
  }

  try {
    await axios.put(
        `https://stackflow.pierrenogaro.com/comments/update/${commentId}/`,
        comment.value,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access')}`, "Content-Type": "application/json" } }
    );
    router.push(`/question/${questionId.value}`);
  } catch (err) {
    if (err.response && err.response.status === 403) {
      error.value = "You are not authorized to edit this comment.";
    } else {
      error.value = "Failed to update the comment.";
    }
  }
};

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  fetchComment();
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