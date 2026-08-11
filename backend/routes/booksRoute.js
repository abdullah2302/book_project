const express = require("express");
const morgan = require("morgan");
const { getAllBooks,getBookById, addBook, updateBook,deleteBook} = require("../controller/userController");
const {checkUniqueTitle} = require("../middleware/middlewareBook");

const router = express.Router();
router.use(morgan("dev"));
router.route("/").get(getAllBooks).post(checkUniqueTitle, addBook);

router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook); 

module.exports = router;