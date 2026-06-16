import { useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Select,
  Textarea,
  Spinner,
} from "flowbite-react";

const UploadProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    imageURL: "",
    category: "",
    description: "",
    price: "",
    branch: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload-product`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSuccessMessage("✅ Product uploaded successfully!");
        setFormData({
          productName: "",
          brandName: "",
          imageURL: "",
          category: "",
          description: "",
          price: "",
          branch: "",
        });
      } else {
        throw new Error("Failed to upload product");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading product");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Add New Product
        </h2>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div>
            <Label htmlFor="productName" value="Product Name" />
            <TextInput
              id="productName"
              name="productName"
              type="text"
              placeholder="Product Name"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="brandName" value="Brand Name" />
            <TextInput
              id="brandName"
              name="brandName"
              type="text"
              placeholder="Brand Name"
              value={formData.brandName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="imageURL" value="Product Image URL" />
            <TextInput
              id="imageURL"
              name="imageURL"
              type="text"
              placeholder="Product Image URL"
              value={formData.imageURL}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category" value="Category" />
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="alcoholic">Ibinyobwa Vyambiye</option>
              <option value="soft-drinks">Ibinyobwa Bitambiye</option>
              <option value="water">Amazi</option>
              <option value="juice">Jus</option>
              <option value="energy-drink">Energy Drink</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="branch" value="Branch" />
            <Select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              <option value="Bujumbura HQ">Bujumbura HQ</option>
              <option value="Kampala">Kampala</option>
              <option value="Uganda">Uganda</option>
              <option value="DRC">DRC</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="price" value="Price (BIF)" />
            <TextInput
              id="price"
              name="price"
              type="number"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description" value="Product Description" />
            <Textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Write product description..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              {isLoading ? <Spinner size="sm" /> : "Upload Product"}
            </Button>
          </div>
        </form>

        {successMessage && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadProduct;
