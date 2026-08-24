import Book from "../model/books.js";
import Author from "../model/author.js";

export async function getAllBooks(req, res) {
    try {
        const books = await Book.find().populate("author", "name");
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function getBookById(req, res) {
    try {
        const book = await Book.findById(req.params.id);
 
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


export async function createBook(req, res) {
    try {
        const book = {
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            category: req.body.category,
            coverImage: req.file ? req.file.path : req.body.coverImage
        };

        const savedBook = await Book.create(book);

        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export async function updateBook(req, res) {
    try {
        const updateData = {
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            category: req.body.category,
            coverImage: req.body.coverImage
        };
        if (req.file) {
            updateData.coverImage = req.file.path;
        }

        if (updateData.price < 0) {
            updateData.price = Math.abs(updateData.price);
        }

        updateData.title = updateData.title.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        updateData.author = updateData.author.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        updateData.category = updateData.category.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteBook(req, res) {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



