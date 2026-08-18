import { API_URL } from "./config.js";

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

        const formData = new FormData();
        formData.append('title', book.title);
        formData.append('author', book.author);
        formData.append('price', book.price);
        formData.append('category', book.category);
        formData.append('coverImage', document.getElementById("coverImage").files[0]);

        try {

            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

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