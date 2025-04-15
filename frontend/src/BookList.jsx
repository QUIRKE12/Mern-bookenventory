import { useEffect, useState } from "react";
import { getAllBooks } from "./api";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getAllBooks()
      .then(setBooks)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {books.map(book => (
        <div key={book._id}>{book.title}</div>
      ))}
    </div>
  );
};

export default BookList;
