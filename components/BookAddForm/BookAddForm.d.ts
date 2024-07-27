type BookEditFormProps = {
    onSubmit: ({ id, title, author, price, genre }: {
        id: any;
        title: any;
        author: any;
        price: any;
        genre: any;
    }) => void;
    onCancel: () => void;
};
declare const BookAddForm: (props: BookEditFormProps) => import("react/jsx-runtime").JSX.Element;
export default BookAddForm;
