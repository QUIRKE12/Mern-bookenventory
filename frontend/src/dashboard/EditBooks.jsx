import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Label, TextInput, Textarea, Select, Button } from "flowbite-react";

const EditBooks = () => {
  const book = useLoaderData(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    imageURL: "",
    category: "",
    bookDescription: "",
    bookPdfURL: ""
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        authorName: book.authorName || "",
        imageURL: book.imageURL || "",
        category: book.category || "",
        bookDescription: book.bookDescription || "",
        bookPdfURL: book.bookPdfURL || ""
      });
    }
  }, [book]);

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
        const response = await fetch(`http://localhost:5000/book/${book._id}`, { 
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to update book");

        alert("Book updated successfully!");
        
        // ✅ Redirect to Manage Books page
        navigate("/admin/manage", { replace: true });
        
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};


  return (
    <div className="ml-56 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Book</h2>

        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Book Title</Label>
            <TextInput
              id="title"
              name="title"
              placeholder="Book name"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="authorName">Author Name</Label>
            <TextInput
              id="authorName"
              name="authorName"
              placeholder="Author Name"
              type="text"
              value={formData.authorName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="imageURL">Book Image URL</Label>
            <TextInput
              id="imageURL"
              name="imageURL"
              placeholder="Book image URL"
              type="text"
              value={formData.imageURL}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Book Category</Label>
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
            <Label htmlFor="bookDescription">Book Description</Label>
            <Textarea
              id="bookDescription"
              name="bookDescription"
              placeholder="Write your book description..."
              rows={6}
              value={formData.bookDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="bookPdfURL">Book PDF URL</Label>
            <TextInput
              id="bookPdfURL"
              name="bookPdfURL"
              placeholder="Book PDF URL"
              type="text"
              value={formData.bookPdfURL}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-2">
            <Button type="submit" className="w-full text-lg p-2 bg-cyan-700 rounded-lg hover:bg-cyan-800">
              Update Book
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBooks;
