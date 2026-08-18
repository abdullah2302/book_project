import { API_URL } from "./config.js";
import { getAllBooks } from "./state.js";
import { getBooks } from "./renderBooks.js";
import { openEditModal } from "./editModal.js";

const booksListEl = document.getElementById("booksList");

if (booksListEl) {

    booksListEl.addEventListener("click", async (e) => {

        const editBtn = e.target.closest(".edit-btn");
        const deleteBtn = e.target.closest(".delete-btn");
        const allBooks = getAllBooks();

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

            const confirmDelete = confirm(`Are you sure you want to delete "${book.title}"?`);

            if (!confirmDelete) {
                return;
            }

            try {

                const deleteResponse = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

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