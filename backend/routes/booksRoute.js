import express from "express";
import morgan from "morgan";
import { getAllBooks, getBookById, createBook, updateBook, deleteBook, getCategoryAggregatedBooks } from "../controller/bookController.js";
import { checkUniqueTitle } from "../middleware/middlewareBook.js";
import { bookValidationRules } from "../validator/bookValidator.js";
import { protect, authorizeRoles } from "../middleware/userMiddleware.js";
import { uploadMiddleware } from "../middleware/upload.js";


const router = express.Router();

router.use(morgan("dev"));

router.route("/")
      .get(getAllBooks)
      .post(protect, uploadMiddleware, bookValidationRules, checkUniqueTitle, createBook);

router.get("/aggregate", getCategoryAggregatedBooks);

router.route("/:id")
      .get(getBookById)
      .put(protect, uploadMiddleware, bookValidationRules, checkUniqueTitle, updateBook)
      .delete(protect, authorizeRoles("admin"), deleteBook);
export default router;