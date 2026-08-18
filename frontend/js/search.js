import { API_URL } from "./config.js";

const searchForm = document.getElementById("searchForm");
const searchQueryInput = document.getElementById("searchQuery");

async function runSearch() {

    const searchResults = document.getElementById("searchResults");

    if (!searchQueryInput || !searchResults) {
        return;
    }

    const searchQuery = searchQueryInput.value.toLowerCase().trim();

    if (!searchQuery) {
        searchResults.innerHTML = "";
        return;
    }

    try {

        const response = await fetch(API_URL);
        const books = await response.json();

        const results = books.filter(book =>
            book.title.toLowerCase().startsWith(searchQuery)
        );

        searchResults.innerHTML = "";

        if (results.length === 0) {
            searchResults.innerHTML = `
                <p class="no-results">
                    No books found.
                </p>
            `;
            return;
        }

        results.forEach(book => {

            const div = document.createElement("div");
            div.className = "book";

            div.innerHTML = `
                <h3>${book.title}</h3>

                <p>
                    <strong>Author:</strong>
                    ${book.author}
                </p>

                <p>
                    <strong>Price:</strong>
                    $${book.price}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${book.category}
                </p>
            `;

            searchResults.appendChild(div);
        });

    } catch (error) {

        console.log("Search error:", error);
    }
}

if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        runSearch();
    });
}

if (searchQueryInput) {

    let searchDebounce;

    searchQueryInput.addEventListener("input", () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(runSearch, 10);
    });
}