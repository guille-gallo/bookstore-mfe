import BaseEntity from './BaseEntity';
export default class Book extends BaseEntity {
    title?: string;
    author?: string;
    price?: number;
    cover_url?: string;
    genre?: 'Science Fiction' | 'History' | 'Fantasy' | '';
    constructor(id: number, title: string, author: string, price: number, cover_url: string, genre: '');
}
