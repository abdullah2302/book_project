import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
       
    },
    qualification: {  
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true
    }
});

authorSchema.index({ name: 1 });

authorSchema.pre("save", function () {
    this.name = this.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    this.qualification = this.qualification.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    this.nationality = this.nationality.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
});

authorSchema.post("save", function (doc) {
    console.log("Author saved:", doc);
});

export default mongoose.model("Author", authorSchema);