// Egyszerű in-memory listakezelő demo
// Később backend API-ra cserélhető

export interface BookList {
  id: string;
  name: string;
  bookIds: number[];
}

let userLists: Record<string, BookList[]> = {};

export function getListsForUser(userId: string): BookList[] {
  return userLists[userId] || [];
}

export function createListForUser(userId: string, name: string): BookList {
  const newList: BookList = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    bookIds: [],
  };
  if (!userLists[userId]) userLists[userId] = [];
  userLists[userId].push(newList);
  return newList;
}

export function addBookToList(userId: string, listId: string, bookId: number) {
  const lists = userLists[userId] || [];
  const list = lists.find(l => l.id === listId);
  if (list && !list.bookIds.includes(bookId)) {
    list.bookIds.push(bookId);
  }
}

export function removeBookFromList(userId: string, listId: string, bookId: number) {
  const lists = userLists[userId] || [];
  const list = lists.find(l => l.id === listId);
  if (list) {
    list.bookIds = list.bookIds.filter(id => id !== bookId);
  }
}

export function removeList(userId: string, listId: string) {
  if (!userLists[userId]) return;
  userLists[userId] = userLists[userId].filter(l => l.id !== listId);
}
