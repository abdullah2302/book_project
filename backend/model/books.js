import mongoose from "mongoose";
import Author from "./author.js";
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Author", 
        required: true 
    },
    price: {
        type: Number,
        
    },
    category: {
        type: String,
        required: true
    },
    coverImage: { 
        type: String
    },
});

bookSchema.index({ category: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ title: 1 });

bookSchema.pre("save", function () {
    this.title = this.title.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    this.category = this.category.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    if (this.price < 0) {
        this.price = Math.abs(this.price);
    }
});

bookSchema.post("save", function (doc) {
    console.log("Book saved:", doc);
});


export default mongoose.model("Book", bookSchema);