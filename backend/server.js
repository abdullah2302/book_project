const express = require("express");

const cors = require("cors");
// const dotenv = require("dotenv");
const path = require("path");
const PORT=3000;
const bookRoutes = require("./routes/booksRoute");
const connectDB = require("./config/db");

// dotenv.config();

const app = express();
connectDB();
const cora=app.use(cors());
// console.log(cora);
app.use(express.json());


 const loc=app.use(express.static(path.join(__dirname, "../frontend")));
//  console.log(loc);


app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

