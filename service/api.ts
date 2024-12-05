import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export const bookService = {
  async searchBooks(query: string, page: number = 1, limit: number = 12) {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const { data } = await api.get(`/books/search?${params}`);
    return data;
  },

  async getFeaturedBooks() {
    const { data } = await api.get("/books/featured");
    return data;
  },

  async getBookDetails(id: string) {
    const { data } = await api.get(`/books/${id}`);
    return data;
  },
};

export default bookService;
