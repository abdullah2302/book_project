import express from "express";
import morgan from "morgan";
import { getAllBooks, getBookById, addBook, updateBook, deleteBook } from "../controller/userController.js";
import { checkUniqueTitle } from "../middleware/middlewareBook.js";

const router = express.Router();
router.use(morgan("dev"));
router.route("/").get(getAllBooks).post(checkUniqueTitle, addBook);

router.route("/:id").get(getBookById).put(checkUniqueTitle, updateBook).delete(deleteBook); 

export default router;