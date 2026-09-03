import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler.js";
import bookRoutes from "./routes/booksRoute.js";
import authorRoutes from "./routes/authorsRoute.js";
import userRoutes from "./routes/userRoute.js";
import { connectDB } from "./config/db.js";
import { apiLimiter } from "./middleware/limiter.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";


dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.set('trust proxy', 1);
app.use(helmet());


app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "https://book-project-k4kg.onrender.com"],
  credentials: true,
}));
app.disable('x-powered-by');

const dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(errorHandler);
connectDB();


app.use('/api/', apiLimiter);
app.use(express.json());

app.use(express.static(path.join(dirname, "../frontend")));
app.use("/uploads", express.static(path.join(dirname, "../uploads")));

app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
