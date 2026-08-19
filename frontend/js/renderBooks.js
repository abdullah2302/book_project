import { API_URL } from "./config.js";
import { setAllBooks } from "./state.js";

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

        div.innerHTML = `
            ${coverHtml}

            <div class="book-info">
                <h3>${book.title}</h3>

                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Price:</strong> $${book.price}</p>
                <p><strong>Category:</strong> ${book.category}</p>

                <div class="book-actions">
                    <button type="button" class="edit-btn" data-id="${book._id}">Edit</button>
                    <button type="button" class="delete-btn" data-id="${book._id}">Delete</button>
                </div>
            </div>
        `;

        booksList.appendChild(div);
    });
}

export async function getBooks() {

    const booksList = document.getElementById("booksList");

    if (!booksList) {
        return;
    }

    try {
         // add loading indicator
        booksList.innerHTML = `
            <p class="loading">
                Loading books...
            </p>
        `;

        const response = await fetch(API_URL);
        const books = await response.json();

        setAllBooks(books);
        renderBooks(books);

    } catch (error) {

        console.log("Error getting books:", error);

        booksList.innerHTML = `
            <p class="no-results">
                Unable to load books.
            </p>
        `;
    }
}