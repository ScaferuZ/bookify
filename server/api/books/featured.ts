import { fetchOpenLibrary, formatBookData, OpenLibraryBook } from "../../utils/openLibrary";

export default defineEventHandler(async (event) => {
  try {
    const popularSubjects = ["bestseller", "trending", "popular", "recommended"];
    const randomSubject = popularSubjects[Math.floor(Math.random() * popularSubjects.length)];

    const params = new URLSearchParams({
      q: `subject:${randomSubject}`,
      limit: "20",
      fields: "key,title,author_name,cover_i,ratings_average,ratings_count,first_publish_year",
    });

    const data = await fetchOpenLibrary(params);

    const filteredBooks = data.docs
      .filter((book: OpenLibraryBook) => book.author_name && book.cover_i && book.title)
      .map(formatBookData)
      .slice(0, 12);

    return {
      books: filteredBooks,
      total: filteredBooks.length,
    };
  } catch (error) {
    console.error("Featured books error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch featured books",
    });
  }
});
