import { debounce } from '../../../utils/debounce';
import database from './database.json';
import { failRandomly, ErrorCode } from '../../../utils/errors';
import Book from '../../domain/Book';

type paginatedType = {
  page?: number;
  perPage?: number;
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('bookstore', 1);

      request.onerror = (event) => {
          reject('Error opening database');
      };

      request.onsuccess = (event) => {
          const db = (event.target as IDBRequest).result;
          resolve(db);
      };

      request.onupgradeneeded = (event) => {
          const db = (event.target as IDBRequest).result;

          const bookStore = db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
          bookStore.createIndex('title', 'title', { unique: false });
          bookStore.createIndex('genre', 'genre', { unique: false });

          const purchaseStore = db.createObjectStore('purchases', { keyPath: 'id', autoIncrement: true });
          purchaseStore.createIndex('user', 'user', { unique: false });
          purchaseStore.createIndex('books', 'books', { unique: false });
      };
  });
};

interface IBook {
  id: number;
  title: string;
  author: string;
  // Add other properties of the book as needed
}

// Function to retrieve all books from IndexedDB
const getAllBooksFromDB = async (): Promise<IBook[]> => {
  const db: IDBDatabase = await openDB();
  const tx = db.transaction('books', 'readonly');
  const store = tx.objectStore('books');
  const request = store.getAll();

  return new Promise<IBook[]>((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
    request.onerror = (event) => {
      reject('Error fetching books');
    };
  });
};

// Function to delete a book from IndexedDB
const deleteBookFromDB = async (bookId: IDBValidKey) => {
  const db: IDBDatabase = await openDB();
  const tx = db.transaction('books', 'readwrite');
  const store = tx.objectStore('books');
  store.delete(bookId);

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => {
      resolve();
    };

    tx.onerror = (event) => {
      reject('Error deleting book');
    };

    tx.onabort = (event) => {
      reject('Transaction aborted');
    };
  });
};



// Function to edit a book in IndexedDB
const editBookInDB = async (editedBook) => {
  const db: IDBDatabase = await openDB();
  const tx = db.transaction('books', 'readwrite');
  const store = tx.objectStore('books');
  store.put(editedBook);

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => {
      resolve();
    };

    tx.onerror = (event) => {
      reject('Error editing book');
    };

    tx.onabort = (event) => {
      reject('Transaction aborted');
    };
  });
};


// Function to add a book to IndexedDB
const addBookToDB = async (book) => {
  const db: IDBDatabase = await openDB();
  const tx = db.transaction('books', 'readwrite');
  const store = tx.objectStore('books');
  store.add(book);

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => {
      resolve();
    };

    tx.onerror = (event) => {
      reject('Error adding book');
    };

    tx.onabort = (event) => {
      reject('Transaction aborted');
    };
  });
};


export async function findBooks({ page = 1, perPage = 25 }: paginatedType = {}) {
  await debounce();

  if (failRandomly()) {
    return { error: { code: ErrorCode.SOMETHING_WENT_WRONG } };
  }

  const setData = (data) => {
    
    let startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, data.length);
    
    if (startIndex > endIndex) {
      startIndex = (startIndex - perPage);
    }
    const finaldata = data.slice(startIndex, endIndex).map((eachBook) => {
      return new Book(eachBook.id, eachBook.title, eachBook.author, eachBook.price, eachBook.cover_url, eachBook.genre);
    });

    return { data: finaldata.length ? finaldata : [] };
    
  };

  const fetchBooks = async () => {
    try {
      const data: Book[] = await getAllBooksFromDB();
      // First load, add all books to IndexedDB:
      if (data.length === 0) { 
        await Promise.all(database.books.map(async (item) => { 
          await addBookToDB(item)
        }));
        return setData(await getAllBooksFromDB())
      }
      if (data.length > 0) {
        return setData(data)
      }
    } catch (error) {
      console.error('Error while fetching books: ', error);
    }
  };
  return await fetchBooks();
}

export async function deleteBook({id}) {
  await deleteBookFromDB(id);
}

export async function addBook(newBook) {
  await addBookToDB(newBook);
}

export async function editBook(editedBook) {
  await editBookInDB(editedBook);
} 