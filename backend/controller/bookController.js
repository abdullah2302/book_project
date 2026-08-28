import Book from "../model/books.js";
import Author from "../model/author.js";
import mongoose from "mongoose";



export async function getAllBooks(req, res) {
    try {
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 8;
        const skip=(page-1)*limit;
        

        const books = await Book.find()
            .skip(skip)
            .limit(limit)
            .populate("author", "name");


        const totalBooks = await Book.countDocuments();

        res.json({
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentBooksCount: books.length,
            currentPage: Number(page),
            defaultLimit: 8,
            books
        });
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



export async function getCategoryAggregatedBooks(req, res) {

    const { category, minPrice, maxPrice, author, authorName, limit } = req.query;

    try {

        const pipeline = [];

    
        pipeline.push({
            $lookup: {
                from: "authors",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails"
            }
        });

        pipeline.push({
            $unwind: {
                path: "$authorDetails",
                preserveNullAndEmptyArrays: true
            }
        });

       
        const matchStage = {};

        if (category) {
            matchStage.category = category;
        }

        if (author) {
            matchStage["authorDetails._id"] = new mongoose.Types.ObjectId(author);
        }

        if (authorName) {
            matchStage["authorDetails.name"] = { $regex: authorName, $options: "i" };
        }

        if (minPrice || maxPrice) {
            matchStage.price = {};
            if (minPrice) matchStage.price.$gte = Number(minPrice);
            if (maxPrice) matchStage.price.$lte = Number(maxPrice);
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        
        pipeline.push({
            $group: {
                _id: "$category",
                titles: { $push: "$title" }, 
                totalBooks: { $sum: 1 },
                averagePrice: { $avg: "$price" },
                maxPrice: { $max: "$price" },
                authors: { $addToSet: "$authorDetails.name" }
            }
        });

      
        pipeline.push({ $sort: { totalBooks: -1 } });

        
        pipeline.push({
            $project: {
                _id: 0,
                category: "$_id",
                titles: 1,
                totalBooks: 1,
                averagePrice: { $round: ["$averagePrice", 2] },
                maxPrice: 1,
                authorCount: { $size: "$authors" },
                authors: 1
            }
        });

       
        if (limit) {
            pipeline.push({ $limit: Number(limit) });
        }

        const result = await Book.aggregate(pipeline);

        res.json(result);

    } catch (error) {
        console.error("Aggregation error:", error);
        res.status(500).json({ message: error.message });
    }
}