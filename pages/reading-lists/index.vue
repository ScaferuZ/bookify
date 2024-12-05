<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">My Reading Lists</h1>

    <!-- Create New List Button -->
    <button
      @click="showCreateModal = true"
      class="mb-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Create New List
    </button>

    <!-- Reading Lists Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="list in readingLists"
        :key="list.id"
        class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <h2
            @click="navigateToList(list.id)"
            class="text-xl font-semibold hover:text-blue-600 cursor-pointer"
          >
            {{ list.name }}
          </h2>
          <button @click="deleteList(list.id)" class="text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>

        <p class="text-gray-600 mb-4">{{ list.description }}</p>

        <div class="flex justify-between text-sm text-gray-500 mb-4">
          <span>{{ list.books.length }} books</span>
          <span>{{ list.isPublic ? "Public" : "Private" }}</span>
        </div>

        <!-- Book List Preview -->
        <div class="space-y-10">
          <div
            v-for="book in list.books.slice(0, 3)"
            :key="book.id"
            class="flex items-center gap-2 hover:bg-gray-50 p-1 rounded mt-4"
          >
            <img :src="book.coverImage" :alt="book.title" class="w-8 h-12 object-cover rounded" />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium truncate">{{ book.title }}</h3>
              <p class="text-xs text-gray-500 truncate">{{ book.author }}</p>
            </div>
            <button
              @click="removeBook(list.id, book.id)"
              class="text-gray-400 hover:text-red-600 ml-4"
            >
              ×
            </button>
          </div>
          <div
            v-if="list.books.length > 3"
            @click="navigateToList(list.id)"
            class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer pt-2 mt-4"
          >
            View all {{ list.books.length }} books →
          </div>
        </div>
      </div>
    </div>

    <!-- Create List Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold mb-4">Create New Reading List</h3>

        <input
          v-model="newList.name"
          type="text"
          placeholder="List Name"
          class="w-full p-2 border rounded mb-2"
        />

        <textarea
          v-model="newList.description"
          placeholder="Description (optional)"
          class="w-full p-2 border rounded mb-2"
          rows="3"
        ></textarea>

        <label class="flex items-center mb-4">
          <input type="checkbox" v-model="newList.isPublic" class="mr-2" />
          Make this list public
        </label>

        <div class="flex justify-end gap-2">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="handleCreateList"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create List
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const showCreateModal = ref(false);
const newList = ref({
  name: "",
  description: "",
  isPublic: false,
});

const { readingLists, createList, deleteList, removeBook } = useReadingList();

const handleCreateList = () => {
  if (!newList.value.name.trim()) return;

  createList(newList.value.name, newList.value.description, newList.value.isPublic);

  // Reset form
  newList.value = {
    name: "",
    description: "",
    isPublic: false,
  };
  showCreateModal.value = false;
};

const navigateToList = (listId: string) => {
  router.push(`/reading-lists/${listId}`);
};
</script>
