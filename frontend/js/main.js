import "./addBook.js";
import "./editModal.js";
import "./bookActions.js";
import "./search.js";
import "./bookOpen.js";
import "./apiHelper.js";
import "./addAuthor.js"
import "./auth.js";
import "./navAuth.js";
import "./sessionTimeout.js";
import { getBooks } from "./renderBooks.js";
import { getAuthors } from "./renderAuthors.js";

getAuthors();

getBooks();