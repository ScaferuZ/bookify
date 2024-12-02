<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="pending" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error.message }}</p>
      <button @click="router.push('/')" class="mt-4 text-blue-600 hover:text-blue-800">
        Return to Home
      </button>
    </div>

    <template v-else-if="data">
      <!-- Back Button -->
      <button
        @click="router.back()"
        class="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        ← Back
      </button>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-9">
        <!-- Left Column - Cover Image -->
        <div class="md:col-span-1">
          <img :src="data.coverImage" :alt="data.title" class="w-full rounded-lg shadow-lg" />

          <!-- Add to Reading List Button -->
          <button class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add to Reading List
          </button>
        </div>

        <!-- <div></div> -->

        <!-- Right Column - Book Details -->
        <div class="md:col-span-2">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ data.title }}
          </h1>

          <p class="text-xl text-gray-600 mb-4">by {{ data.author.name }}</p>

          <!-- Rating -->
          <div class="flex items-center mb-6">
            <div class="flex text-yellow-400">
              <span v-for="i in 5" :key="i">
                {{ i <= Math.floor(data.rating.average) ? "★" : "☆" }}
              </span>
            </div>
            <span class="text-gray-600 ml-2">
              {{ data.rating.average.toFixed(1) }}
              ({{ data.rating.count }} ratings)
            </span>
          </div>

          <!-- Book Information -->
          <div class="prose max-w-none mb-8">
            <h2 class="text-xl font-semibold mb-2">About this book</h2>
            <p class="text-gray-600">{{ data.description || "No description available." }}</p>
          </div>

          <!-- Publication Details -->
          <div class="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 class="text-xl font-semibold mb-4">Details</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-gray-600">First published</dt>
                <dd class="font-medium">{{ data.publishDate }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">Author</dt>
                <dd class="font-medium">{{ data.author.name }}</dd>
              </div>
            </dl>
          </div>

          <!-- Subjects/Genres -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Genres</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="subject in data.subjects.slice(0, 8)"
                :key="subject"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {{ subject }}
              </span>
            </div>
          </div>

          <!-- Author Bio -->
          <div v-if="data.author.bio" class="mb-8">
            <h2 class="text-xl font-semibold mb-4">About the Author</h2>
            <p class="text-gray-600">{{ data.author.bio }}</p>
          </div>
        </div>
      </div>
      <div class="mt-12" v-if="data.similarBooks?.length">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Similar Books You Might Like</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <BookCard
            v-for="book in data.similarBooks"
            :key="book.id"
            :book="book"
            class="hover:scale-105 transition-transform duration-200"
          />
        </div>
      </div>

      <!-- No Similar Books Message -->
      <div v-else-if="data.similarBooks?.length === 0" class="mt-12 text-center text-gray-600">
        No similar books found
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const { data, pending, error } = await useFetch(`/api/books/${route.params.id}`);
</script>

<style scoped>
.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>
