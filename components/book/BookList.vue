<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <BookCard
      v-for="book in books"
      :key="book.id"
      :book="book"
      @click="navigateToBook(book.id)"
      class="hover:scale-105 transition-transform duration-200"
    />
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
