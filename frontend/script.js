
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




async function getBooks() {

    const booksList = document.getElementById("booksList");

    if (!booksList) {
        return;
    }

    try {

        const response = await fetch(API_URL);

        const books = await response.json();

        booksList.innerHTML = "";

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
            `;

            booksList.appendChild(div);

        });

    } catch (error) {

        console.log("Error getting books:", error);

        booksList.innerHTML = `
            <p class="no-results">
                Unable to load books.
            </p>
        `;
    }
}

getBooks();









const deleteForm = document.getElementById("deleteForm");

if (deleteForm) {

    deleteForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const title = document
            .getElementById("deleteTitle")
            .value
            .toLowerCase()
            .trim();

        try {

            // Get all books
            const response = await fetch(API_URL);

            const books = await response.json();

            // Find book by title
            const book = books.find(
                book => book.title.toLowerCase() === title
            );

            if (!book) {

                alert("Book not found.");

                return;
            }

            const confirmDelete = confirm(
                `Are you sure you want to delete "${book.title}"?`
            );

            if (!confirmDelete) {
                return;
            }

            // Delete book using MongoDB ID
            const deleteResponse = await fetch(
                `${API_URL}/${book._id}`,
                {
                    method: "DELETE"
                }
            );

            if (deleteResponse.ok) {

                alert("Book deleted successfully!");

                deleteForm.reset();

            } else {

                alert("Error deleting book.");

            }

        } catch (error) {

            console.log("Delete error:", error);

            alert("Something went wrong.");

        }

    });

}




const searchForm = document.getElementById("searchForm");
if (searchForm) {

    searchForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const searchQuery = document
            .getElementById("searchQuery")
            .value
            .toLowerCase()
            .trim();

        const searchResults =
            document.getElementById("searchResults");

        try {

            // Get all books
            const response = await fetch(API_URL);

            const books = await response.json();


            // Search by title or author
            const results = books.filter(book => {

                return (
                    book.title.toLowerCase().startsWith(searchQuery)
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

    });

}


const editForm = document.getElementById("editForm");

if (editForm) {

    editForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const searchTitle = document
            .getElementById("editTitle")
            .value
            .toLowerCase()
            .trim();

        if (!searchTitle) {
            alert("Please enter the book title to update.");
            return;
        }

        try {

            // Get all books
            const response = await fetch(API_URL);
            const books = await response.json();

            // Find book by title
            const book = books.find(
                book => book.title.toLowerCase() === searchTitle
            );

            // Book not found
            if (!book) {
                alert("Book not found.");
                return;
            }

            const updatedBook = {
                title: document.getElementById("title").value,
                author: document.getElementById("author").value,
                price: document.getElementById("price").value,
                category: document.getElementById("category").value
            };


            const updateResponse = await fetch(`${API_URL}/${book._id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedBook)

            });

            if (updateResponse.ok) {

                alert("Book updated successfully!");

                window.location.href = "/viewAll.html";

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


getBooks();

