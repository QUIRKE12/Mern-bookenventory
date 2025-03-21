import { useEffect, useState } from "react";
import BarnnerCards from "../components/BookCards";

const BestSellerBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => setBooks(data.slice(0, 8)));
  }, []);

  return (
    <div className="px-4 lg:px-24 my-16">
      <BarnnerCards books={books} headline="Best Seller Books" />
    </div>
  );
};

export default BestSellerBooks;
