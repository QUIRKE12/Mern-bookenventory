const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
const uri = "mongodb+srv://mern-book-store:Hj7JbThtXkQWYRFV@cluster0.nci0m.mongodb.net/BookInventory?retryWrites=true&w=majority";

// Create MongoClient
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Connect to MongoDB
async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB successfully!");

        const bookCollections = client.db("BookInventory").collection("Books");

        // ✅ Fix: Add a homepage route
        app.get("/", (req, res) => {
            res.send("Backend is running successfully!");
        });

        // Insert a book (POST)
        app.post("/upload-book", async (req, res) => {
            const { title, authorName, imageURL, category, bookDescription, bookPdfURL } = req.body;
            
            if (!title || !authorName || !imageURL || !category || !bookDescription || !bookPdfURL) {
                return res.status(400).json({ error: "All fields are required" });
            }

            try {
                const newBook = { title, authorName, imageURL, category, bookDescription, bookPdfURL };
                await bookCollections.insertOne(newBook);
                res.status(201).json({ success: true, message: "Book uploaded successfully", book: newBook });
            } catch (error) {
                res.status(500).json({ error: "Failed to add book", details: error.message });
            }
        });

        // Get all books (GET)
        app.get("/all-books", async (req, res) => {
            try {
                const query = req.query?.category ? { category: req.query.category } : {};
                const books = await bookCollections.find(query).toArray();
                res.json(books);
            } catch (error) {
                console.error("Error fetching books:", error);
                res.status(500).json({ error: "Failed to fetch books" });
            }
        });

        // Get a single book (GET)
        app.get("/books/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const book = await bookCollections.findOne({ _id: new ObjectId(id) });

                if (!book) {
                    return res.status(404).json({ error: "Book not found" });
                }

                res.json(book);
            } catch (error) {
                console.error("Error fetching book:", error);
                res.status(500).json({ error: "Failed to fetch book" });
            }
        });

        // Update a book (PATCH)
        app.patch("/book/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updateBookData = req.body;
                const result = await bookCollections.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateBookData }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: "Book not found or no changes made" });
                }

                res.json({ success: true, message: "Book updated successfully", result });
            } catch (error) {
                console.error("Error updating book:", error);
                res.status(500).json({ error: "Failed to update book" });
            }
        });

        // Delete a book (DELETE)
        app.delete("/book/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await bookCollections.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount > 0) {
                    res.json({ success: true, message: "Book deleted successfully" });
                } else {
                    res.status(404).json({ success: false, message: "Book not found" });
                }
            } catch (error) {
                console.error("Error deleting book:", error);
                res.status(500).json({ success: false, error: "Failed to delete book" });
            }
        });

        // ✅ Fix: Start server only after MongoDB is connected
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Start the app
run().catch(console.dir);
