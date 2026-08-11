const express = require("express");
const { getAllBooks,getBookById, addBook, updateBook,deleteBook} = require("../controller/userController");
const {checkUniqueTitle} = require("../middleware/middlewareBook");

const router = express.Router();

router.route("/").get(getAllBooks).post(checkUniqueTitle, addBook);

router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook); 

module.exports = router;