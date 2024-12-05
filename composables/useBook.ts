import { ref, computed } from "vue";
import bookService from "~/service/api";

export const useBook = () => {
  const books = ref([]);
  const featuredBooks = ref([]);
  const currentBook = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const total = ref(0);
  const currentPage = ref(1);

  const isLoading = computed(() => loading.value);

  const searchBooks = async (query: string, page = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await bookService.searchBooks(query, page);
      books.value = response.books;
      total.value = response.total;
      currentPage.value = page;
    } catch (e) {
      error.value = "Failed to search books";
      console.error("Search error:", e);
    } finally {
      loading.value = false;
    }
  };

  const getFeaturedBooks = async () => {
    if (featuredBooks.value.length) return; // Return cached data if available

    loading.value = true;
    error.value = null;

    try {
      const response = await bookService.getFeaturedBooks();
      featuredBooks.value = response.books;
    } catch (e) {
      error.value = "Failed to fetch featured books";
      console.error("Featured books error:", e);
    } finally {
      loading.value = false;
    }
  };

  const getBookDetails = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const book = await bookService.getBookDetails(id);
      currentBook.value = book;
      return book;
    } catch (e) {
      error.value = "Failed to fetch book details";
      console.error("Book details error:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    books,
    featuredBooks,
    currentBook,
    loading: isLoading,
    error,
    total,
    currentPage,
    searchBooks,
    getFeaturedBooks,
    getBookDetails,
  };
};
