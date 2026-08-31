
import { API_URL } from "./config.js";
import { setAllBooks } from "./state.js";
import { showToast } from "./toast.js";


let currentPage = Number(new URLSearchParams(window.location.search).get("page")) || 1;
const limit = 8;


export function getCurrentPage() {
    return currentPage;
}

function updateURL(page) {
    const url = new URL(window.location);
    url.searchParams.set("page", page);
    url.searchParams.set("limit", limit);
    window.history.replaceState({}, "", url);
}

export function renderBooks(books) {

    const booksList = document.getElementById("booksList");

    if (!booksList) {
        return;
    }

    booksList.innerHTML = "";

    if (books.length === 0) {
        booksList.innerHTML = `
            <p class="no-results">
                No books found.
            </p>
        `;
        return;
    }

    books.forEach(book => {

        const div = document.createElement("div");
        div.className = "book";

        const coverHtml = book.coverImage
            ? `<img src="${book.coverImage}" alt="${book.title} Cover" class="book-cover">`
            : `<div class="book-cover no-cover">No Image</div>`;

        const authorName = book.author?.name || "Unknown Author";

        div.innerHTML = `
    ${coverHtml}

    <div class="book-info">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${authorName}</p>
        <p><strong>Price:</strong> $${book.price}</p>
        <p><strong>Category:</strong> ${book.category}</p>

        <div class="book-actions">
            <button type="button" class="edit-btn" data-id="${book._id}">
                <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button type="button" class="delete-btn" data-id="${book._id}">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
        </div>
    </div>
`;

        booksList.appendChild(div);
    });
}

function renderPaginationControls(currentPageNum, totalPages) {

    const booksContainer = document.querySelector(".books-container");
    let paginationEl = document.getElementById("paginationControls");

    if (!paginationEl) {
        paginationEl = document.createElement("div");
        paginationEl.id = "paginationControls";
        paginationEl.className = "pagination-controls";
        booksContainer.appendChild(paginationEl);
    }

    if (totalPages <= 1) {
        paginationEl.innerHTML = "";
        return;
    }

    paginationEl.innerHTML = `
    <button type="button" id="prevPage" ${currentPageNum === 1 ? "disabled" : ""}>
        <i class="fa-solid fa-arrow-left"></i> Previous
    </button>
    <span class="page-info">Page ${currentPageNum} of ${totalPages}</span>
    <button type="button" id="nextPage" ${currentPageNum === totalPages ? "disabled" : ""}>
        Next <i class="fa-solid fa-arrow-right"></i>
    </button>
`;

    document.getElementById("prevPage")?.addEventListener("click", () => {
        if (currentPage > 1) {
            getBooks(currentPage - 1);
        }
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            getBooks(currentPage);
        }
    });
}

export async function getBooks(page = currentPage) {

    const booksList = document.getElementById("booksList");

    if (!booksList) {
        return;
    }

    currentPage = page;
    updateURL(currentPage);

    try {

        booksList.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading books...</p>
            </div>
        `;

        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);

        if (response.status === 429) {
            booksList.innerHTML = `
                <p class="no-results">
                    Too many requests. Please wait a moment and refresh.
                </p>
            `;
            return;
        }

        const data = await response.json();

        setAllBooks(data.books);
        renderBooks(data.books);
        renderPaginationControls(data.currentPage, data.totalPages);

    } catch (error) {

        showToast("Error getting books:", error);

        booksList.innerHTML = `
            <p class="no-results">
                Unable to load books.
            </p>
        `;
    }
}