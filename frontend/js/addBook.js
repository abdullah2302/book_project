import { API_URL } from "./config.js";
import { apiRequest } from "./apiRequest.js";

const bookForm = document.getElementById("bookForm");

if (bookForm) {

    bookForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const authorSelect = document.getElementById("author");

        if (!authorSelect.value || authorSelect.value === "__add_new__") {
            alert("Please select or add an author.");
            return;
        }

        const formData = new FormData();
        formData.append('title', document.getElementById("title").value);
        formData.append('author', authorSelect.value);  
        formData.append('price', document.getElementById("price").value);
        formData.append('category', document.getElementById("category").value);
        formData.append('coverImage', document.getElementById("coverImage").files[0]);

        try {

             const response = await apiRequest(API_URL, {
                method: "POST",
                body: formData
            });

            if (response.status === 401) {
                alert("You are not authorized. Please log in.");
                return;
            }

            if (response.status === 429) {
                const data = await response.json();
                alert(data.message || "Too many requests. Please try again later.");
                return;
            }

            if (response.ok) {
                alert("Book added successfully!");
                bookForm.reset();
            } else {
                const data = await response.json();
                const msg = data.errors?.[0]?.message || data.message || "Error adding book.";
                alert(msg);
            }

        } catch (error) {
            console.log("Error:", error);
        }
    });
}