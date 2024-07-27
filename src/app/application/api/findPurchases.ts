

import { debounce } from '../../../utils/debounce';
import database from './database.json';
import { failRandomly, ErrorCode } from '../../../utils/errors';

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request: IDBOpenDBRequest = window.indexedDB.open('bookstore', 1);
  
      request.onerror = (event) => {
        reject('Error opening database');
      };
  
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('books')) {
          db.createObjectStore('books', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('purchases')) {
          db.createObjectStore('purchases', { keyPath: 'id' });
        }
      };
    });
  };
  
  interface Purchase {
    id: number;
    bookId: number;
    purchaseDate: Date;
    // Add other properties of the purchase as needed
  }
  
  const getPurchasedBooks = async (): Promise<Purchase[]> => {
    const db: IDBDatabase = await openDB();
    const tx = db.transaction('purchases', 'readonly');
    const store = tx.objectStore('purchases');
    const request: IDBRequest = store.getAll();
  
    const purchases: Purchase[] = await new Promise((resolve, reject) => {  
      request.onsuccess = () => resolve(request.result as Purchase[]);
      request.onerror = () => reject(request.error);
    });
  
    return purchases;
  };
  

  interface Purchase {
    id: number;
    bookId: number;
    purchaseDate: Date;
    // Add other properties of the purchase as needed
  }
  
  const addPurchaseToDB = async (purchase: Purchase): Promise<void> => {
    const db: IDBDatabase = await openDB();
    const tx = db.transaction('purchases', 'readwrite');
    const store = tx.objectStore('purchases');
    store.add(purchase);
  
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => {
        resolve();
      };
  
      tx.onerror = (event) => {
        reject('Error adding purchase');
      };
  
      tx.onabort = (event) => {
        reject('Transaction aborted');
      };
    });
  };  

export async function findPurchases() {
    await debounce();

    if (failRandomly()) {
        return { error: { code: ErrorCode.SOMETHING_WENT_WRONG } };
    }

    const fetchPurchases = async () => {
        try {
          let purchases: Purchase[] = await getPurchasedBooks();
          if (purchases.length === 0) {
            await Promise.all(database.purchases.map(async (item) => {
              await addPurchaseToDB(item as unknown as Purchase);
            }));
            purchases = await getPurchasedBooks();
            return { data: purchases };
          }
          if (purchases.length > 0) {
            return { data: purchases };
          }
        } catch (error) {
          console.error(error);
        }
      };
      
    return await fetchPurchases();
}