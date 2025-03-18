<template>
  <div class="container">
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="card bg-dark text-light border-warning shadow-lg p-4">
      <div class="card-body">
        <h1 class="text-center display-3 fw-bold text-warning mb-4">👤 {{profile.user}}</h1>

        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="mb-3">
              <h4 class="text-warning">Bio</h4>
              <p class="fs-5">{{ profile.bio || 'No bio provided' }}</p>
            </div>

            <div class="mb-3">
              <h4 class="text-warning">Location</h4>
              <p class="fs-5">{{ profile.location || 'No location provided' }}</p>
            </div>

            <div class="mb-3">
              <h4 class="text-warning">Favorites</h4>
              <p class="fs-5">{{ favorites.length || 0 }} questions favorited</p>

              <div v-if="favorites.length > 0" class="mt-3">
                <h5 class="text-warning">My Favorite Questions:</h5>
                <ul class="list-group">
                  <li v-for="favorite in favorites" :key="favorite.id" class="list-group-item bg-dark text-light border-warning mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <router-link :to="`/question/${favorite.id}`" class="text-light text-decoration-none">
                          <strong class="text-warning">{{ favorite.title }}</strong>
                          <span class="text-muted">by {{ favorite.author }}</span>
                        </router-link>
                      </div>
                      <button @click="removeFavorite(favorite.id)" class="btn btn-sm btn-outline-danger">
                        🗑 Delete
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
              <p v-else class="text-muted">You haven't added any favorites yet.</p>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
              <router-link to="/profile/edit" class="btn btn-warning">
                ✏️ Edit Profile
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const { isAuthenticated, user } = useAuth();
const profile = ref({});
const loading = ref(true);
const favorites = ref([]);

const loadUserProfile = () => {
  const userSpecificKey = `userProfile_${user.value}`;

  const savedProfile = localStorage.getItem(userSpecificKey);
  if (savedProfile) {
    profile.value = JSON.parse(savedProfile);
  } else {
    profile.value = {
      user: user.value,
      bio: "Edit your profile to add a bio",
      location: "Edit your profile to add your location",
      favorite_count: 0
    };

    localStorage.setItem(userSpecificKey, JSON.stringify(profile.value));
  }

  const userFavoritesKey = `userFavorites_${user.value}`;
  const savedFavorites = localStorage.getItem(userFavoritesKey);
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites);
  } else {
    favorites.value = [];
  }
};

const removeFavorite = (id) => {
  const newFavorites = favorites.value.filter(fav => fav.id !== id);
  favorites.value = newFavorites;
  const userFavoritesKey = `userFavorites_${user.value}`;
  localStorage.setItem(userFavoritesKey, JSON.stringify(newFavorites));
  profile.value.favorite_count = newFavorites.length;
  const userProfileKey = `userProfile_${user.value}`;
  localStorage.setItem(userProfileKey, JSON.stringify(profile.value));
};

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  loadUserProfile();

  loading.value = false;
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

.list-group-item {
  transition: all 0.2s ease;
}

.list-group-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>