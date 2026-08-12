const Book = require("../model/books");



async function getAllBooks(req, res) {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


async function getBookById(req, res) {
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


async function addBook(req, res) {
    try {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            category: req.body.category
        });

        const savedBook = await book.save();

        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


async function updateBook(req, res) {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
           { returnDocument: 'after' }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


async function deleteBook(req, res) {
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


module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
};


