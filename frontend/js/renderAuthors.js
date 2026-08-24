import { API_URL, AUTHOR_API_URL } from "./config.js";
import { setAllAuthors } from "./state.js";

export function renderAuthors(authors) {

    const authorSelect = document.getElementById("author");

    if (!authorSelect) {
        return;
    }

    // "Select Author" wali pehli option ko rakho, baaki hata do
    authorSelect.innerHTML = `<option value="">Select Author</option>`;

    authors.forEach(author => {
        const option = document.createElement("option");
        option.value = author._id;       // ObjectId jayega backend ko, naam nahi
        option.textContent = author.name;
        authorSelect.appendChild(option);
    });

    // "Add new author" hamesha list ke aakhir mein
    const addNewOption = document.createElement("option");
    addNewOption.value = "__add_new__";
    addNewOption.textContent = "+ Add new author";
    authorSelect.appendChild(addNewOption);
}

export async function getAuthors() {

    const authorSelect = document.getElementById("author");

    if (!authorSelect) {
        return;
    }

    try {
        const response = await fetch(AUTHOR_API_URL);
        const authors = await response.json();
        setAllAuthors(authors);
        renderAuthors(authors);
    } catch (error) {
        console.error("Error fetching authors:", error);
    }
}