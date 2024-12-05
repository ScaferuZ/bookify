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
        <span v-if="featuredPending" class="text-sm font-normal text-gray-500"> Loading... </span>
      </h2>

      <div v-if="featuredError" class="text-red-500">Failed to load featured books</div>

      <BookList v-else :books="featuredData?.books || []" />
    </section>

    <!-- Search Results Section -->
    <section v-else class="py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Search Results
        <span v-if="searchPending" class="text-sm font-normal text-gray-500"> Loading... </span>
      </h2>

      <div v-if="searchError" class="text-red-500">Failed to search books</div>

      <template v-else>
        <div v-if="searchData?.books.length === 0" class="text-gray-500">
          No books found for "{{ searchQuery }}"
        </div>

        <BookList v-else :books="searchData?.books || []" />

        <!-- Load More Button -->
        <div
          v-if="searchData && searchData.total > searchData.books.length"
          class="text-center mt-8"
        >
          <button
            @click="loadMore"
            :disabled="searchPending"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ searchPending ? "Loading..." : "Load More" }}
          </button>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const searchQuery = ref("");
const currentPage = ref(1);
const isSearching = ref(false);

const {
  data: featuredData,
  pending: featuredPending,
  error: featuredError,
} = await useFetch("/api/books/featured");

const {
  data: searchData,
  pending: searchPending,
  error: searchError,
  refresh: refreshSearch,
} = await useFetch(
  () =>
    searchQuery.value
      ? `/api/books/search?q=${encodeURIComponent(searchQuery.value)}&page=${currentPage.value}`
      : null,
  {
    immediate: false,
  },
);

// Debounced search function
const debouncedSearch = useDebounceFn(async () => {
  if (!searchQuery.value.trim()) {
    isSearching.value = false;
    return;
  }

  currentPage.value = 1;
  isSearching.value = true;
  await refreshSearch();
}, 300); // 300ms delay

// Watch for search query changes
watch(searchQuery, () => {
  debouncedSearch();
});

const loadMore = async () => {
  if (searchPending.value) return;

  currentPage.value++;
  await refreshSearch();
};

// Composable for debounce functionality
function useDebounceFn(fn: Function, delay: number) {
  let timeout: NodeJS.Timeout;

  return function (...args: any[]) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
</script>
