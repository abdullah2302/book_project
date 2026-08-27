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
        debounceTimer = setTimeout(runFilter, 250);
    });
}

if (filterField) {

    filterField.addEventListener("change", () => {

        // Placeholder update karo selected field ke hisaab se
        viewAllSearch.placeholder = placeholders[filterField.value] || "Search...";

        // Field switch hote hi turant re-filter karo agar kuch type ho chuka hai
        if (viewAllSearch.value.trim()) {
            runFilter();
        }
    });
}