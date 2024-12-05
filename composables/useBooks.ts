import type { IBook } from "~/types/IBook";

export const useBooks = () => {
  const books = ref<IBook[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const searchQuery = ref("");

  const fetchBooks = async (page = 1, query = "") => {
    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        q: query,
        limit: "12",
      });

      const { data, error: fetchError } = await useFetch<{
        books: IBook[];
        total: number;
      }>("/api/books/search", {
        params,
        method: "GET",
      });

      if (fetchError.value) {
        error.value = fetchError.value.message;
        return;
      }

      if (data.value) {
        if (page === 1) {
          books.value = data.value.books;
        } else {
          books.value = [...books.value, ...data.value.books];
        }
        total.value = data.value.total;
        currentPage.value = page;
        searchQuery.value = query;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      loading.value = false;
    }
  };

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      error.value = "Search term is required";
      return;
    }
    await fetchBooks(1, query);
  };

  const loadMoreBooks = async () => {
    if (books.value.length < total.value) {
      await fetchBooks(currentPage.value + 1, searchQuery.value);
    }
  };

  return {
    books,
    loading,
    error,
    total,
    currentPage,
    fetchBooks,
    searchBooks,
    loadMoreBooks,
  };
};
