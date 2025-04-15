// src/api.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all books
export const getAllBooks = async () => {
  const res = await fetch(`${BASE_URL}/book`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};

// Get single book by ID
export const getBookById = async (id) => {
  const res = await fetch(`${BASE_URL}/book/${id}`);
  if (!res.ok) throw new Error("Failed to fetch book");
  return res.json();
};

// Create a new book
export const createBook = async (bookData) => {
  const res = await fetch(`${BASE_URL}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
};

// Update a book
export const updateBook = async (id, updatedData) => {
  const res = await fetch(`${BASE_URL}/book/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
};

// Delete a book
export const deleteBook = async (id) => {
  const res = await fetch(`${BASE_URL}/book/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete book");
  return res.json();
};
