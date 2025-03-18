<template>
  <div class="container">
    <div class="card bg-dark text-light border-warning shadow-lg p-4">
      <div class="card-body">
        <h1 class="text-center display-3 fw-bold text-warning mb-4">✏️ Edit Profile</h1>

        <form @submit.prevent="saveProfile">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <div class="mb-3">
                <h4 class="text-warning">Bio</h4>
                <textarea class="form-control bg-dark text-light border-warning" v-model="profile.bio" rows="3"></textarea>
              </div>

              <div class="mb-3">
                <h4 class="text-warning">Location</h4>
                <input type="text" class="form-control bg-dark text-light border-warning" v-model="profile.location">
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <button type="submit" class="btn btn-warning">Save Changes</button>
                <router-link to="/profile" class="btn btn-outline-warning">Cancel</router-link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { isAuthenticated, user } = useAuth();
const profile = ref({
  bio: '',
  location: ''
});

const loadProfile = () => {
  const userProfileKey = `userProfile_${user.value}`;
  const savedProfile = localStorage.getItem(userProfileKey);

  if (savedProfile) {
    profile.value = JSON.parse(savedProfile);
  } else {
    profile.value = {
      user: user.value,
      bio: "Edit your bio here",
      location: "Edit your location here",
      favorite_count: 0
    };
  }
};

const saveProfile = () => {
  profile.value.user = user.value;

  const userProfileKey = `userProfile_${user.value}`;
  localStorage.setItem(userProfileKey, JSON.stringify(profile.value));

  router.push('/profile');
};

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  loadProfile();
});
</script>

<style scoped>
.container {
  max-width: 900px;
  margin-top: 100px;
}

.text-warning {
  color: #f8d210 !important;
}

.card {
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(248, 210, 16, 0.5);
}

.form-control:focus {
  border-color: #f8d210;
  box-shadow: 0 0 0 0.25rem rgba(248, 210, 16, 0.25);
}
</style>