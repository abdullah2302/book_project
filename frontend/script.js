const API_URL = "/api/books";



const bookForm = document.getElementById("bookForm");

if (bookForm) {

    bookForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const book = {
            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            price: document.getElementById("price").value,
            category: document.getElementById("category").value
        };

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(book)
            });

            if (response.ok) {

                alert("Book added successfully!");

                bookForm.reset();

            } else {

                const data = await response.json();
                alert("Error adding book: " + data.message);
            }

        } catch (error) {

            console.log("Error:", error);

        }

    });

}




// ==========================
// VIEW ALL + EDIT/DELETE
// ==========================

let allBooks = []; // holds the full book list, used to find a book by id for edit/delete

function renderBooks(books) {

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

            <div class="book-actions">
                <button type="button" class="edit-btn" data-id="${book._id}">Edit</button>
                <button type="button" class="delete-btn" data-id="${book._id}">Delete</button>
            </div>
        `;

        booksList.appendChild(div);

    });
}

async function getBooks() {

    const booksList = document.getElementById("booksList");

    if (!booksList) {
        return;
    }

    try {

        const response = await fetch(API_URL);

        const books = await response.json();

        allBooks = books;

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


// ---- Edit modal ----

const editModalOverlay = document.getElementById("editModalOverlay");
const editForm = document.getElementById("editForm");
const closeEditModal = document.getElementById("closeEditModal");

function openEditModal(book) {

    if (!editModalOverlay) {
        return;
    }

    document.getElementById("editId").value = book._id;
    document.getElementById("editTitleInput").value = book.title;
    document.getElementById("editAuthorInput").value = book.author;
    document.getElementById("editPriceInput").value = book.price;
    document.getElementById("editCategoryInput").value = book.category;

    editModalOverlay.classList.add("open");
}

function closeEditModalFn() {
    if (editModalOverlay) {
        editModalOverlay.classList.remove("open");
    }
}

if (closeEditModal) {
    closeEditModal.addEventListener("click", closeEditModalFn);
}

if (editModalOverlay) {

    // Close when clicking outside the modal box
    editModalOverlay.addEventListener("click", (e) => {
        if (e.target === editModalOverlay) {
            closeEditModalFn();
        }
    });
}

if (editForm) {

    editForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const id = document.getElementById("editId").value;

        const updatedBook = {
            title: document.getElementById("editTitleInput").value,
            author: document.getElementById("editAuthorInput").value,
            price: document.getElementById("editPriceInput").value,
            category: document.getElementById("editCategoryInput").value
        };

        try {

            const updateResponse = await fetch(`${API_URL}/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedBook)

            });

            if (updateResponse.ok) {

                alert("Book updated successfully!");

                closeEditModalFn();

                getBooks();

            } else {

                const data = await updateResponse.json();

                alert(data.message || "Error updating book.");

            }

        } catch (error) {

            console.error("Update error:", error);

            alert("Something went wrong.");

        }

    });

}


// ---- Edit/Delete button clicks (event delegation on the list) ----

const booksListEl = document.getElementById("booksList");

if (booksListEl) {

    booksListEl.addEventListener("click", async (e) => {

        const editBtn = e.target.closest(".edit-btn");
        const deleteBtn = e.target.closest(".delete-btn");

        if (editBtn) {

            const id = editBtn.dataset.id;
            const book = allBooks.find(b => b._id === id);

            if (book) {
                openEditModal(book);
            }

            return;
        }

        if (deleteBtn) {

            const id = deleteBtn.dataset.id;
            const book = allBooks.find(b => b._id === id);

            if (!book) {
                return;
            }

            const confirmDelete = confirm(
                `Are you sure you want to delete "${book.title}"?`
            );

            if (!confirmDelete) {
                return;
            }

            try {

                const deleteResponse = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

                if (deleteResponse.ok) {

                    alert("Book deleted successfully!");

                    getBooks();

                } else {

                    alert("Error deleting book.");

                }

            } catch (error) {

                console.log("Delete error:", error);

                alert("Something went wrong.");

            }

        }

    });

}


getBooks();






const searchForm = document.getElementById("searchForm");
const searchQueryInput = document.getElementById("searchQuery");

async function runSearch() {

    const searchResults = document.getElementById("searchResults");

    if (!searchQueryInput || !searchResults) {
        return;
    }

    const searchQuery = searchQueryInput
        .value
        .toLowerCase()
        .trim();

    // Empty box -> clear results instead of showing everything
    if (!searchQuery) {
        searchResults.innerHTML = "";
        return;
    }

    try {

        // Get all books
        const response = await fetch(API_URL);

        const books = await response.json();


        // Search by title (only titles starting with the query)
        const results = books.filter(book => {

            return (
                book.title.toLowerCase().startsWith(searchQuery)
                // ||book.title.toLowerCase().includes(searchQuery)
            );

        });


        // Clear old results
        searchResults.innerHTML = "";


        // No results
        if (results.length === 0) {

            searchResults.innerHTML = `
                <p class="no-results">
                    No books found.
                </p>
            `;

            return;
        }


        // Display search results
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
        searchDebounce = setTimeout(runSearch, 250);
    });
}