import axios from "axios";

const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Book ID is required",
      });
    }

    const [bookResponse, authorResponse] = await Promise.all([
      axios.get(`${OPEN_LIBRARY_BASE_URL}/works/${id}.json`),
      axios.get(`${OPEN_LIBRARY_BASE_URL}/authors/${id}.json`).catch(() => null),
    ]);

    const bookData = bookResponse.data;
    const authorData = authorResponse?.data;

    let similarBooks = [];
    if (bookData.subjects?.length) {
      const randomSubjects = bookData.subjects
        .slice(0, 3)
        .map((subject: string) => encodeURIComponent(subject))
        .join(" OR ");

      const { data: similarData } = await axios.get(
        `${OPEN_LIBRARY_BASE_URL}/search.json?q=subject:(${randomSubjects})&limit=6`,
      );
      similarBooks = similarData.docs
        .filter((book: any) => book.key !== `/works/${id}`)
        .map(formatBookData)
        .slice(0, 5);
    }

    return {
      id,
      title: bookData.title,
      description: bookData.description?.value || bookData.description || "",
      coverImage: bookData.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`
        : "https://placehold.co/400x600",
      author: {
        name: authorData?.name || "Unknown Author",
        bio: authorData?.bio?.value || authorData?.bio || "",
      },
      publishDate: bookData.first_publish_date || "Unknown",
      subjects: bookData.subjects || [],
      rating: {
        average: bookData.ratings?.average?.value || 0,
        count: bookData.ratings?.count || 0,
      },
      similarBooks,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message,
    });
  }
});

// Helper function
const formatBookData = (book: any) => ({
  id: book.key.replace("/works/", ""),
  title: book.title,
  author: book.author_name?.[0] ?? "Unknown Author",
  coverImage: book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://placehold.co/400x600",
  publishedYear: book.first_publish_year ?? 0,
  averageRating: book.ratings_average ?? 0,
  ratingsCount: book.ratings_count ?? 0,
});
