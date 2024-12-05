<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="text-center py-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Discover Your Next Great Read</h1>
      <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Share your literary journey, connect with fellow readers, and explore new worlds through
        books.
      </p>
      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search books, authors, or genres..."
          class="w-full px-6 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </section>

    <!-- Featured Books Section -->
    <section v-if="!isSearching" class="py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Trending Books
        <LoadingSpinner v-if="loading" class="inline ml-2" />
      </h2>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div v-for="n in 8" :key="n" class="animate-pulse">
          <div class="bg-gray-200 rounded-lg aspect-w-2 aspect-h-3"></div>
          <div class="mt-2 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-red-500 text-center py-8">
        {{ error }}
        <button @click="loadFeaturedBooks" class="text-blue-600 hover:text-blue-800 ml-2">
          Try Again
        </button>
      </div>

      <!-- Books Grid -->
      <BookList v-else :books="featuredBooks" />
    </section>

    <!-- Search Results Section -->
    <section v-else class="py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Search Results
        <LoadingSpinner v-if="loading" class="inline ml-2" />
      </h2>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div v-for="n in 8" :key="n" class="animate-pulse">
          <div class="bg-gray-200 rounded-lg aspect-w-2 aspect-h-3"></div>
          <div class="mt-2 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-red-500 text-center py-8">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="books.length === 0" class="text-gray-500 text-center py-8">
        No books found for "{{ searchQuery }}"
      </div>

      <!-- Books Grid -->
      <template v-else>
        <BookList :books="books" />

        <!-- Load More Button -->
        <div v-if="hasMoreBooks" class="text-center mt-8">
          <button
            @click="loadMore"
            :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? "Loading..." : "Load More" }}
          </button>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

const { books, featuredBooks, loading, error, total, currentPage, searchBooks, getFeaturedBooks } =
  useBook();

const searchQuery = ref("");
const isSearching = ref(false);

// Computed
const hasMoreBooks = computed(() => {
  return books.value.length < total.value;
});

// Load featured books on mount
const loadFeaturedBooks = async () => {
  if (featuredBooks.value.length === 0) {
    await getFeaturedBooks();
  }
};
loadFeaturedBooks();

// Debounced search function
const debouncedSearch = useDebounceFn(async () => {
  if (!searchQuery.value.trim()) {
    isSearching.value = false;
    return;
  }

  isSearching.value = true;
  await searchBooks(searchQuery.value);
}, 300);

// Watch for search query changes
watch(searchQuery, () => {
  debouncedSearch();
});

// Load more results
const loadMore = async () => {
  if (loading.value) return;
  await searchBooks(searchQuery.value, currentPage.value + 1);
};
</script>
