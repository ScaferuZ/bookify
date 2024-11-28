import { fetchOpenLibrary, formatBookData } from "../../utils/openLibrary";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchTerm = query.q?.toString() || "";
    const page = Number(query.page) || 1;
    const limit = 12;

    if (!searchTerm) {
      throw createError({
        statusCode: 400,
        statusMessage: "Search term is required",
      });
    }

    const params = new URLSearchParams({
      q: searchTerm,
      page: page.toString(),
      limit: limit.toString(),
      fields: "key,title,author_name,cover_i,ratings_average,ratings_count,first_publish_year",
      mode: "everything",
    });

    const data = await fetchOpenLibrary(params);

    return {
      books: data.docs.map(formatBookData),
      total: data.numFound,
      page,
      limit,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to search books",
    });
  }
});
