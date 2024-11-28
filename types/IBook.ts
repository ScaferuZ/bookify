export interface IBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genre: string[];
  publishedYear: number;
  isbn?: string;
  language: string;
  pageCount: number;
  averageRating: number;
}

export interface ReadingList {
  id: string;
  name: string;
  description: string;
  books: IBook[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
