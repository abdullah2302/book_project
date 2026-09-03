import { getAllBooks } from "./state.js";
import { renderBooks } from "./renderBooks.js";

const viewAllSearch = document.getElementById("viewAllSearch");
const filterField = document.getElementById("filterField");

const placeholders = {
    title: "Type book title...",
    category: "Type category...",
    price: "Type price...",
    author: "Type author name..."
};

function getFieldValue(book, field) {

    switch (field) {
        case "title":
            return book.title || "";
        case "category":
            return book.category || "";
        case "price":
            return book.price?.toString() || "";
        case "author":
            return book.author?.name || "";
        default:
            return "";
    }
}

function runFilter() {

    const query = viewAllSearch.value.toLowerCase().trim();
    const field = filterField.value;
    const allBooks = getAllBooks();

    if (!query) {
        renderBooks(allBooks);
        return;
    }

    const filtered = allBooks.filter(book => {
        const value = getFieldValue(book, field).toLowerCase();
        return value.startsWith(query);
    });

    renderBooks(filtered);
}

if (viewAllSearch) {

    let debounceTimer;

    viewAllSearch.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(runFilter);
    });
}

if (filterField) {

    filterField.addEventListener("change", () => {


        viewAllSearch.placeholder = placeholders[filterField.value] || "Search...";


        if (viewAllSearch.value.trim()) {
            runFilter();
        }
    });
}