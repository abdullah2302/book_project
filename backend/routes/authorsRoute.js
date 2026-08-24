import express from "express";
import morgan from "morgan";
import {getAllAuthors, createAuthor} from "../controller/authorController.js";


const router = express.Router();
router.use(morgan("dev"));

router.route("/").get(getAllAuthors).post(createAuthor);

export default router; 