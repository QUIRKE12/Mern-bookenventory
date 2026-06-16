import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Label, TextInput, Textarea, Select, Button } from "flowbite-react";

const EditProduct = () => {
  const product = useLoaderData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    imageURL: "",
    category: "",
    description: "",
    price: "",
    branch: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        brandName: product.brandName || "",
        imageURL: product.imageURL || "",
        category: product.category || "",
        description: product.description || "",
        price: product.price || "",
        branch: product.branch || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/product/${product._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update product");

      alert("Product updated successfully!");
      navigate("/admin/manage-products", { replace: true });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-3xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Product</h2>

      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="productName">Product Name</Label>
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
          <Label htmlFor="brandName">Brand Name</Label>
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
          <Label htmlFor="imageURL">Product Image URL</Label>
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
          <Label htmlFor="category">Product Category</Label>
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
          <Label htmlFor="branch">Branch</Label>
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
          <Label htmlFor="description">Product Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Andika insiguro y'ikinyobwa..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price (BIF)</Label>
          <TextInput
            id="price"
            name="price"
            type="number"
            placeholder="Shiramwo igiciro"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full text-lg p-2 bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Update Product
        </Button>
      </form>
    </div>
  );
};

export default EditProduct;
