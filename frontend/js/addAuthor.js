import { AUTHOR_API_URL } from "./config.js";
import { getAuthors } from "./renderAuthors.js";

const authorSelect = document.getElementById("author");
const newAuthorSection = document.getElementById("newAuthorSection");
const newAuthorNameInput = document.getElementById("newAuthorName");
const newAuthorQualificationInput = document.getElementById("newAuthorQualification");
const newAuthorBirthDateInput = document.getElementById("newAuthorBirthDate");
const newAuthorNationalityInput = document.getElementById("newAuthorNationality");
const saveNewAuthorBtn = document.getElementById("saveNewAuthor");
const cancelNewAuthorBtn = document.getElementById("cancelNewAuthor");

if (authorSelect) {

    authorSelect.addEventListener("change", () => {

        if (authorSelect.value === "__add_new__") {
            newAuthorSection.style.display = "flex";
            newAuthorNameInput.focus();
        } else {
            newAuthorSection.style.display = "none";
        }
    });
}

if (saveNewAuthorBtn) {

    saveNewAuthorBtn.addEventListener("click", async () => {

        const name = newAuthorNameInput.value.trim();
        const qualification = newAuthorQualificationInput.value.trim();
        const birthDate = newAuthorBirthDateInput.value;
        const nationality = newAuthorNationalityInput.value.trim();

        if (!name || !qualification || !birthDate || !nationality) {
            alert("Please fill all author fields.");
            return;
        }

        try {

            const response = await fetch(AUTHOR_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, qualification, birthDate, nationality })
            });

            if (!response.ok) {
                const data = await response.json();
                alert(data.message || "Error adding author.");
                return;
            }

            const newAuthor = await response.json();

            await getAuthors();

            authorSelect.value = newAuthor._id;

            newAuthorSection.style.display = "none";
            newAuthorNameInput.value = "";
            newAuthorQualificationInput.value = "";
            newAuthorBirthDateInput.value = "";
            newAuthorNationalityInput.value = "";

        } catch (error) {
            console.error("Error adding author:", error);
            alert("Something went wrong.");
        }
    });
}

if (cancelNewAuthorBtn) {

    cancelNewAuthorBtn.addEventListener("click", () => {
        newAuthorSection.style.display = "none";
        authorSelect.value = "";
    });
}