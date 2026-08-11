const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://books_user_123:hCGxkWeEPicwOwDf@cluster0.pquiq48.mongodb.net/";

const connectDB = () => {
    mongoose
        .connect(MONGO_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((error) => {
            console.log("MongoDB connection error:", error);
        });
};

module.exports = connectDB;