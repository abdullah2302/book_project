const bookAnimated = document.getElementById("bookAnimated");
const bookCover = document.getElementById("bookCover");

if (bookAnimated && bookCover) {

    bookCover.addEventListener("click", () => {
        bookAnimated.classList.toggle("open");
    });
}