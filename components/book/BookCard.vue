<template>
  <div
    class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('click')"
  >
    <div class="aspect-w-2 aspect-h-3 bg-gray-200">
      <img :src="book.coverImage" :alt="book.title" class="object-cover w-full h-full" />
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 mb-1 line-clamp-1">{{ book.title }}</h3>
      <p class="text-sm text-gray-600 mb-2">{{ book.author }}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex text-yellow-400">
            <span v-for="i in 5" :key="i" class="text-sm">
              {{ i <= Math.floor(book.averageRating) ? "★" : "☆" }}
            </span>
          </div>
          <span class="text-sm text-gray-500 ml-2">
            {{ book.averageRating.toFixed(1) }}
          </span>
        </div>
        <span class="text-sm text-gray-500">
          {{ book.publishedYear }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBook } from "~/types/IBook";

defineProps<{
  book: IBook;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>
