import book from "../model/books.js";

export async function checkUniqueTitle(req, res, next) {
    try {
        const { title } = req.body;
        const bookId = req.params.id;

      
        const existingBook = await book.findOne({ title });

        
        if (existingBook && existingBook._id.toString() !== bookId) {
            return res.status(400).json({ message: "Book title must be unique" });
        }

        next();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
