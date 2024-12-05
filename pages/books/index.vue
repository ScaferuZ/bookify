<script setup>
import { useDebounceFn } from "@vueuse/core";
const { books, loading, total, searchBooks, loadMoreBooks } = useBooks();

const searchQuery = ref("");
const debouncedSearch = useDebounceFn((query) => {
  if (query.trim()) {
    searchBooks(query);
  }
}, 500);

const handleSearch = () => {
  debouncedSearch(searchQuery.value);
};
</script>

<template>
  <div>
    <input v-model="searchQuery" @input="handleSearch" placeholder="Search books..." />
    <BookList :books="books" :loading="loading" />
    <button v-if="books.length < total" @click="loadMoreBooks">Load More</button>
  </div>
</template>
