import React, { useState } from "react";
import { Button, Label, TextInput, Select, Textarea, Spinner } from "flowbite-react";

const UploadBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    imageURL: "",
    category: "",
    bookDescription: "",
    bookPdfURL: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/upload-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("✅ Your book has been uploaded successfully!");
        setFormData({ title: "", authorName: "", imageURL: "", category: "", bookDescription: "", bookPdfURL: "" });
      } else {
        throw new Error("Failed to upload book.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading book. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Upload A Book</h2>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title" value="Book Title" />
            <TextInput id="title" name="title" placeholder="Book name" type="text" value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="authorName" value="Author Name" />
            <TextInput id="authorName" name="authorName" placeholder="Author Name" type="text" value={formData.authorName} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="imageURL" value="Book Image URL" />
            <TextInput id="imageURL" name="imageURL" placeholder="Book image URL" type="text" value={formData.imageURL} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="category" value="Book Category" />
            <Select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="mystery">Mystery</option>
              <option value="fantasy">Fantasy</option>
              <option value="science-fiction">Science Fiction</option>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="bookDescription" value="Book Description" />
            <Textarea id="bookDescription" name="bookDescription" placeholder="Write your book description..." rows={6} value={formData.bookDescription} onChange={handleChange} required />
          </div>

          <div className="col-span-2">
            <Label htmlFor="bookPdfURL" value="Book PDF URL" />
            <TextInput id="bookPdfURL" name="bookPdfURL" placeholder="Book PDF URL" type="text" value={formData.bookPdfURL} onChange={handleChange} required />
          </div>

          <div className="col-span-2">
            <Button type="submit" className="w-full text-lg p-2 bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 rounded-lg flex justify-center items-center" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" className="mr-2" /> : "Upload Book"}
            </Button>
          </div>
        </form>

        {successMessage && <p className="mt-4 text-center text-green-600 font-semibold">{successMessage}</p>}
      </div>
    </div>
  );
};

export default UploadBook;
