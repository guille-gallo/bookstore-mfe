import Book from '../../app/domain/Book';
type BookEditFormProps = {
    book: Book;
    onSubmit: ({ id, title, author, price, cover_url, genre }: {
        id: any;
        title: any;
        author: any;
        price: any;
        cover_url: any;
        genre: any;
    }) => void;
};
declare const BookEditForm: (props: BookEditFormProps) => import("react/jsx-runtime").JSX.Element;
export default BookEditForm;
