import { ErrorCode } from '../../../utils/errors';
type paginatedType = {
    page?: number;
    perPage?: number;
};
export declare function findBooks({ page, perPage }?: paginatedType): Promise<{
    data: any;
} | {
    error: {
        code: ErrorCode;
    };
}>;
export declare function deleteBook({ id }: {
    id: any;
}): Promise<void>;
export declare function addBook(newBook: any): Promise<void>;
export declare function editBook(editedBook: any): Promise<void>;
export {};
