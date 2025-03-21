import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons

const ManageBooks = () => {
  const [allBooks, setAllBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => setAllBooks(data));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    fetch(`http://localhost:5000/book/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Book deleted successfully");
          setAllBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
        } else {
          alert("Failed to delete book: " + data.message);
        }
      })
      .catch((error) => console.error("Error deleting book:", error));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Books</h2>
        
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Author Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allBooks.map((book, index) => (
              <tr key={book._id} className="bg-white">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{book.authorName}</td>
                <td className="border px-4 py-2">{book.category}</td>
                <td className="border px-4 py-2 flex justify-center space-x-4">
                  <button onClick={() => navigate(`/admin/edit-books/${book._id}`)} className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(book._id)} className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center">
                    <FaTrashAlt /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooks;
