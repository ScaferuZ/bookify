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
          <button
            @click="showReadingListModal = true"
            class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add to Reading List
          </button>

          <!-- Reading List Modal -->
          <div
            v-if="showReadingListModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 class="text-xl font-semibold mb-4">Add to Reading List</h3>

              <!-- Create New List Form -->
              <div v-if="showNewListForm" class="mb-4">
                <input
                  v-model="newListName"
                  type="text"
                  placeholder="List Name"
                  class="w-full p-2 border rounded mb-2"
                />
                <textarea
                  v-model="newListDescription"
                  placeholder="Description (optional)"
                  class="w-full p-2 border rounded mb-2"
                ></textarea>
                <label class="flex items-center mb-4">
                  <input type="checkbox" v-model="newListIsPublic" class="mr-2" />
                  Make this list public
                </label>
                <div class="flex justify-end gap-2">
                  <button
                    @click="showNewListForm = false"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    @click="createNewList"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create & Add Book
                  </button>
                </div>
              </div>

              <!-- Existing Lists -->
              <div v-else>
                <div v-if="readingLists.length" class="mb-4">
                  <div
                    v-for="list in readingLists"
                    :key="list.id"
                    class="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    @click="addToList(list.id)"
                  >
                    <h4 class="font-medium">{{ list.name }}</h4>
                    <p class="text-sm text-gray-600">{{ list.books.length }} books</p>
                  </div>
                </div>

                <div class="flex justify-between mt-4">
                  <button @click="showNewListForm = true" class="text-blue-600 hover:text-blue-800">
                    Create New List
                  </button>
                  <button
                    @click="showReadingListModal = false"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
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
            @click="navigateToBook(book.id)"
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
const showReadingListModal = ref(false);
const showNewListForm = ref(false);
const newListName = ref("");
const newListDescription = ref("");
const newListIsPublic = ref(false);

const { data, pending, error } = await useFetch(`/api/books/${route.params.id}`);

const { readingLists, createList, addBookList, error: readingListError } = useReadingList();

// Create new list and add current book
const createNewList = () => {
  if (!newListName.value.trim()) return;

  const list = createList(newListName.value, newListDescription.value, newListIsPublic.value);

  if (list && data.value) {
    addToList(list.id);
  }

  // Reset form
  newListName.value = "";
  newListDescription.value = "";
  newListIsPublic.value = false;
  showNewListForm.value = false;
  showReadingListModal.value = false;
};

// Add to existing list
const addToList = (listId: string) => {
  if (!data.value) return;

  const success = addBookList(listId, {
    id: data.value.id,
    title: data.value.title,
    author: data.value.author.name,
    coverImage: data.value.coverImage,
    description: data.value.description,
    publishedYear: parseInt(data.value.publishDate) || 0,
    genre: data.value.subjects,
    averageRating: data.value.rating.average,
    language: "en",
    pageCount: 0,
  });

  if (success) {
    showReadingListModal.value = false;
  }
};

const navigateToBook = (id: string) => {
  router.push(`/books/${id}`);
};
</script>

<style scoped>
.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>
