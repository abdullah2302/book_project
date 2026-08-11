const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

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