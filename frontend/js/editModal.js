import { API_URL, AUTHOR_API_URL } from "./config.js";
import { getBooks, getCurrentPage } from "./renderBooks.js";
import { getAuthors } from "./renderAuthors.js";
import { apiRequest } from "./apiRequest.js";
import { showToast } from "./toast.js";

const editModalOverlay = document.getElementById("editModalOverlay");
const editForm = document.getElementById("editForm");
const closeEditModal = document.getElementById("closeEditModal");
const editAuthorSelect = document.getElementById("editAuthorInput");

async function populateAuthorDropdown(selectedAuthorId) {

    try {
        const response = await fetch(AUTHOR_API_URL);
        const authors = await response.json();

        editAuthorSelect.innerHTML = `<option value="">Select Author</option>`;

        authors.forEach(author => {
            const option = document.createElement("option");
            option.value = author._id;
            option.textContent = author.name;

            if (author._id === selectedAuthorId) {
                option.selected = true;
            }

            editAuthorSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading authors for edit modal:", error);
    }
}

export async function openEditModal(book) {

    if (!editModalOverlay) {
        return;
    }

    document.getElementById("editId").value = book._id;
    document.getElementById("editTitleInput").value = book.title;
    document.getElementById("editPriceInput").value = book.price;
    document.getElementById("editCategoryInput").value = book.category;
    document.getElementById("editCoverImageInput").value = "";

    const currentAuthorId = book.author?._id || book.author || "";

    await populateAuthorDropdown(currentAuthorId);

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

        const formData = new FormData();
        formData.append('title', document.getElementById("editTitleInput").value);
        formData.append('author', editAuthorSelect.value);
        formData.append('price', document.getElementById("editPriceInput").value);
        formData.append('category', document.getElementById("editCategoryInput").value);

        const fileInput = document.getElementById("editCoverImageInput");
        if (fileInput.files[0]) {
            formData.append('coverImage', fileInput.files[0]);
        }

        try {

            const updateResponse = await apiRequest(`${API_URL}/${id}`, {
                method: "PUT",
                body: formData
            });

            if (updateResponse.ok) {

                showToast("Book updated successfully!", "success");
                closeEditModalFn();
                getBooks(getCurrentPage());

            } else {

                const data = await updateResponse.json();
                const msg = data.errors?.[0]?.message || data.message || "Error updating book.";
                showToast("Please login....!");
            }

        } catch (error) {

            console.error("Update error:", error);
            showToast("Something went wrong.", "error");
        }
    });
}