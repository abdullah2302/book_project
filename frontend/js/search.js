import { getAllBooks } from "./state.js";
import { renderBooks } from "./renderBooks.js";

const viewAllSearch = document.getElementById("viewAllSearch");

if (viewAllSearch) {

    let debounceTimer;

    viewAllSearch.addEventListener("input", () => {

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {

            const query = viewAllSearch.value.toLowerCase().trim();
            const allBooks = getAllBooks();

            if (!query) {
                renderBooks(allBooks); 
                return;
            }

            const filtered = allBooks.filter(book =>
                book.title.toLowerCase().startsWith(query)
            );

            renderBooks(filtered);

        }, 250);
    });
}