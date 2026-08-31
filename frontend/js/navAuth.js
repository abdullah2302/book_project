import { isLoggedIn, isAdmin, getUser } from "./authStorage.js";
import { logoutUser } from "./auth.js";

const navLinks = document.querySelector(".nav-links");

if (navLinks) {

    if (isLoggedIn()) {

        const user = getUser();

        const logoutBtn = document.createElement("a");
        logoutBtn.href = "#";
        logoutBtn.textContent = `Logout (${user?.username && user?.email || "User"})`;
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logoutUser();
        });

        navLinks.appendChild(logoutBtn);
    } else {

        const loginLink = document.createElement("a");
        loginLink.href = "/login.html";
        loginLink.textContent = "Login";
        navLinks.appendChild(loginLink);
    }
}