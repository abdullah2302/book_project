import express from "express";
import morgan from "morgan";
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "../controller/bookController.js";
import { checkUniqueTitle } from "../middleware/middlewareBook.js";
import { bookValidationRules } from "../validator/bookValidator.js";
import {upload} from "../middleware/upload.js";


const router = express.Router();

router.use(morgan("dev"));
router.route("/")
      .get(getAllBooks)
      .post(upload.single('coverImage'), bookValidationRules, checkUniqueTitle, createBook);

router.route("/:id")
      .get(getBookById)
      .put(upload.single('coverImage'), bookValidationRules, checkUniqueTitle, updateBook)
      .delete(deleteBook);

export default router;