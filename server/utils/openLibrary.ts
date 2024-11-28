const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  covers?: string;
  description?: {
    value: string;
  };
  language?: string[];
  ratings_average?: number;
}

export interface OpenLibraryResponse {
  docs: OpenLibraryBook[];
  numFound: number;
  start: number;
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  ratings_average?: number;
  ratings_count?: number;
}

// Formats the raw API data into our app's format
const formatBookData = (book: OpenLibraryBook) => ({
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

export const fetchOpenLibrary = async (searchParams: URLSearchParams) => {
  const response = await fetch(`${OPEN_LIBRARY_BASE_URL}/search.json?${searchParams}`);
  if (!response.ok) throw new Error("Failed to fetch from Open Library");
  return response.json();
};

export { formatBookData };

export const getBookDetails = async (bookId: string) => {
  const response = await fetch(`${OPEN_LIBRARY_BASE_URL}/works/${bookId}.json`);

  if (!response.ok) {
    throw new Error("Failed to fetch book details");
  }

  return response.json() as Promise<OpenLibraryBook>;
};
