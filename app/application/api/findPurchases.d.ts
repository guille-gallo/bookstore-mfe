import { ErrorCode } from '../../../utils/errors';
interface Purchase {
    id: number;
    bookId: number;
    purchaseDate: Date;
}
interface Purchase {
    id: number;
    bookId: number;
    purchaseDate: Date;
}
export declare function findPurchases(): Promise<{
    data: Purchase[];
} | {
    error: {
        code: ErrorCode;
    };
}>;
export {};
