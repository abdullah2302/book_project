import { API_URL } from "./config.js";
import { getAllBooks } from "./state.js";
  import { getBooks, getCurrentPage } from "./renderBooks.js";
import { openEditModal } from "./editModal.js";
import { apiRequest } from "./apiRequest.js";

const booksListEl = document.getElementById("booksList");

if (booksListEl) {

    booksListEl.addEventListener("click", async (e) => {

        const editBtn = e.target.closest(".edit-btn");
        console.log("Edit button clicked:", editBtn);

        const deleteBtn = e.target.closest(".delete-btn");
        console.log("Delete button clicked:", deleteBtn);
        const allBooks = getAllBooks();

        if (editBtn) {

            const id = editBtn.dataset.id;
            const book = allBooks.find(b => b._id === id);

            if (book) {
                await openEditModal(book);   
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

            const deleteResponse = await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });

            if (deleteResponse.status === 401) {
                alert("You are not Admin. if you are admin Login and give the proof to delete the book.");
                return;
            }

            if (deleteResponse.ok) {
                alert("Book deleted successfully!");
                getBooks(getCurrentPage());
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