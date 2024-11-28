import type { IBook } from "~/types/IBook";

interface BookState {
  books: IBook[];
  total: number;
  currentPage: number;
  limit: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export const useBookStore = defineStore("book", {
  state: (): BookState => ({
    books: [],
    total: 0,
    currentPage: 1,
    limit: 12,
    loading: false,
    error: null,
    searchQuery: "",
  }),

  actions: {
    async fetchBooks(page: number = 1, search: string = "") {
      this.loading = true;
      this.error = null;

      try {
        const query = new URLSearchParams({
          page: page.toString(),
          ...(search && { search }),
        });

        const { data: response } = await useFetch(`/api/books?${query}`);

        if (response.value) {
          this.books = response.value.books;
          this.total = response.value.total;
          this.currentPage = page;
        }
      } catch (error) {
        this.error = "Failed to fetch books";
      } finally {
        this.loading = false;
      }
    },

    async searchBooks(query: string) {
      this.searchQuery = query;
      await this.fetchBooks(1, query);
    },

    async loadMoreBooks() {
      if (!this.loading && this.hasMoreBooks) {
        await this.fetchBooks(this.currentPage + 1, this.searchQuery);
      }
    },
  },

  getters: {
    hasMoreBooks: (state) => {
      return state.total > state.books.length;
    },
  },
});
