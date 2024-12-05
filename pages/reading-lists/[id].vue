<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <button @click="router.back()" class="flex items-center text-gray-600 hover:text-gray-900 mb-6">
      ← Back
    </button>

    <div v-if="list" class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ list.name }}</h1>
          <p class="text-gray-600">{{ list.description }}</p>
          <div class="mt-2 text-sm text-gray-500">
            {{ list.books.length }} books • {{ list.isPublic ? "Public" : "Private" }} list
          </div>
        </div>
        <button @click="handleDelete" class="text-red-600 hover:text-red-800">Delete List</button>
      </div>

      <!-- Books Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="book in list.books"
          :key="book.id"
          class="flex gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
        >
          <img :src="book.coverImage" :alt="book.title" class="w-12 h-16 object-cover rounded" />
          <div class="flex-1 min-w-0">
            <h3 class="font-medium">{{ book.title }}</h3>
            <p class="text-sm text-gray-600">{{ book.author }}</p>
            <div class="flex items-center mt-2">
              <div class="flex text-yellow-400 text-sm">
                <span v-for="i in 5" :key="i">
                  {{ i <= Math.floor(book.averageRating) ? "★" : "☆" }}
                </span>
              </div>
              <span class="text-sm text-gray-500 ml-1">
                {{ book.averageRating.toFixed(1) }}
              </span>
            </div>
          </div>
          <button @click="handleRemoveBook(book.id)" class="text-gray-400 hover:text-red-600">
            ×
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="list.books.length === 0" class="text-center py-12 text-gray-500">
        No books in this list yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const listId = route.params.id as string;

const { readingLists, deleteList, removeBook } = useReadingList();

const list = computed(() => readingLists.value.find((l) => l.id === listId));

const handleDelete = () => {
  if (confirm("Are you sure you want to delete this list?")) {
    deleteList(listId);
    router.push("/reading-lists");
  }
};

const handleRemoveBook = (bookId: string) => {
  removeBook(listId, bookId);
};
</script>
