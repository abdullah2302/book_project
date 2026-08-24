import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler.js";
import bookRoutes from "./routes/booksRoute.js";
import authorRoutes from "./routes/authorsRoute.js";
import { connectDB } from "./config/db.js";
import { apiLimiter } from "./middleware/limiter.js";
import helmet from "helmet";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(helmet());

app.disable('x-powered-by');

const dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(errorHandler);
connectDB();

app.use(cors());
app.use('/api/', apiLimiter);
app.use(express.json());

app.use(express.static(path.join(dirname, "../frontend")));
app.use("/uploads", express.static(path.join(dirname, "../uploads")));

app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
