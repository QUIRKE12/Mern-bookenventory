import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ManageProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/all-products`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    fetch(`${import.meta.env.VITE_API_URL}/product/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Product deleted successfully");
          setAllProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== id)
          );
        } else {
          alert("Failed to delete product");
        }
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Manage Products
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Brand</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Branch</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product, index) => (
              <tr key={product._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{product.productName}</td>
                <td className="border px-4 py-2">{product.brandName}</td>
                <td className="border px-4 py-2">{product.category}</td>
                <td className="border px-4 py-2">{product.branch}</td>
                <td className="border px-4 py-2">{product.price} BIF</td>
                <td className="border px-4 py-2 flex justify-center gap-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/edit-product/${product._id}`)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-2"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-2"
                  >
                    <FaTrashAlt />
                    Delete
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

export default ManageProducts;
