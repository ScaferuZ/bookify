import type { IBook } from "~/types/IBook";
import { ref, onMounted } from "vue";

interface ReadingList {
  id: string;
  name: string;
  description: string;
  books: IBook[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useReadingList = () => {
  const readingLists = ref<ReadingList[]>([]);
  const currentList = ref<ReadingList | null>(null);
  const error = ref<string | null>(null);

  onMounted(() => {
    initializeLists();
  });

  const initializeLists = () => {
    try {
      const stored = localStorage.getItem("readingLists");
      readingLists.value = stored ? JSON.parse(stored) : [];
    } catch (e) {
      error.value = "Failed to load reading lists";
      window.alert("Failed to load reading lists");
      readingLists.value = [];
    }
  };

  const createList = (name: string, description: string = "", isPublic: boolean = false) => {
    const newList: ReadingList = {
      id: crypto.randomUUID(),
      name,
      description,
      books: [],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    readingLists.value.push(newList);
    saveLists();
    window.alert(`Reading list "${name}" created`);
    return newList;
  };

  const addBookList = (listId: string, book: IBook) => {
    const list = readingLists.value.find((list) => list.id === listId);
    if (!list) {
      error.value = "List not found";
      window.alert("List not found");
      return false;
    }

    if (list.books.some((b) => b.id === book.id)) {
      error.value = "Book already in list";
      window.alert("Book already in list");
      return false;
    }

    list.books.push(book);
    list.updatedAt = new Date().toISOString();
    saveLists();
    window.alert(`Book "${book.title}" added to list "${list.name}"`);
    return true;
  };

  const removeBook = (listId: string, bookId: string) => {
    const list = readingLists.value.find((list) => list.id === listId);
    if (!list) {
      error.value = "List not found";
      window.alert("List not found");
      return false;
    }

    list.books = list.books.filter((b) => b.id !== bookId);
    list.updatedAt = new Date().toISOString();
    saveLists();
    window.alert("Book removed from list");
    return true;
  };

  const deleteList = (listId: string) => {
    const list = readingLists.value.find((l) => l.id === listId);
    readingLists.value = readingLists.value.filter((l) => l.id !== listId);
    saveLists();
    if (list) {
      window.alert(`Deleted reading list "${list.name}"`);
    }
  };

  const updateList = (listId: string, updates: Partial<ReadingList>) => {
    const list = readingLists.value.find((l) => l.id === listId);
    if (!list) {
      error.value = "Reading list not found";
      return false;
    }

    Object.assign(list, { ...updates, updatedAt: new Date().toISOString() });
    saveLists();
    window.alert(`Reading list "${list.name}" updated`);
    return true;
  };

  const saveLists = () => {
    try {
      localStorage.setItem("readingLists", JSON.stringify(readingLists.value));
      error.value = null;
    } catch (e) {
      error.value = "Failed to save reading lists";
      window.alert("Failed to save reading lists");
    }
  };

  return {
    readingLists,
    currentList,
    error,
    createList,
    addBookList,
    removeBook,
    deleteList,
    updateList,
    initializeLists,
  };
};
