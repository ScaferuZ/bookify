<template>
  <div v-if="pending" class="flex justify-center py-8">
    <p>Loading books...</p>
  </div>
  <div v-else-if="error" class="flex justify-center py-8">
    <p class="text-red-500">{{ error }}</p>
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <BookCard v-for="book in books" :key="book.id" :book="book" @click="navigateToBook(book.id)" />
  </div>
</template>

<script setup lang="ts">
import type { Book } from "~/types/book";

defineProps<{
  books: Book[];
}>();

const router = useRouter();

const navigateToBook = (id: string) => {
  router.push(`/books/${id}`);
};
</script>
