import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import bookRoutes from "./routes/booksRoute.js";
import {connectDB} from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT ;
const app = express();


const dirname = path.dirname(fileURLToPath(import.meta.url));


connectDB();


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(dirname, "../frontend")));


app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
