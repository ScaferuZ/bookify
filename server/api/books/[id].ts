import { IBook } from "~/types/IBook";
import { formatBookData } from "../../utils/openLibrary";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Book ID is required",
      });
    }

    // Fetch book details
    const response = await fetch(`https://openlibrary.org/works/${id}.json`);
    if (!response.ok) throw new Error("Failed to fetch book details");
    const bookData = await response.json();

    // Fetch author details
    let authorData = null;
    if (bookData.authors?.[0]?.author?.key) {
      const authorResponse = await fetch(
        `https://openlibrary.org${bookData.authors[0].author.key}.json`,
      );
      if (authorResponse.ok) {
        authorData = await authorResponse.json();
      }
    }

    let similarBooks = [];
    if (bookData.subjects && bookData.subjects.length > 0) {
      // Take two random subjects to get a mix of similar books
      const randomSubjects = bookData.subjects
        .slice(0, 3)
        .map((subject: string) => encodeURIComponent(subject))
        .join(" OR ");

      const similarBooksResponse = await fetch(
        `https://openlibrary.org/search.json?q=subject:(${randomSubjects})&limit=6&fields=key,title,author_name,cover_i,ratings_average,first_publish_year`,
      );

      if (similarBooksResponse.ok) {
        const similarBooksData = await similarBooksResponse.json();
        // Filter out the current book and format the data
        similarBooks = similarBooksData.docs
          .filter((book: any) => book.key !== `/works/${id}`)
          .map(formatBookData)
          .slice(0, 5); // Limit to 5 books
      }
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
  } catch (error) {
    console.error("Book details error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to fetch book details",
    });
  }
});
