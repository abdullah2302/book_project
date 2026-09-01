import { isLoggedIn, isAdmin, getUser } from "./authStorage.js";
import { logoutUser } from "./auth.js";

const navLinks = document.querySelector(".nav-links");

if (navLinks) {

    if (isLoggedIn()) {

        const user = getUser();

        const userMenu = document.createElement("div");
        userMenu.className = "user-menu";

        userMenu.innerHTML = `
            <button type="button" class="user-menu-trigger">
                <i class="fa-solid fa-circle-user"></i>
                <span>${user.username || user.name || "Account"}</span>
                <i class="fa-solid fa-chevron-down user-menu-arrow"></i>
            </button>

            <div class="user-menu-dropdown">
                <div class="user-menu-info">
                    <p class="user-menu-name">${user.username || user.name || "User"}</p>
                    <p class="user-menu-email">${user.email || ""}</p>
                    <span class="user-menu-role role-${user.role}">${user.role}</span>
                </div>
                <button type="button" class="user-menu-logout">
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </div>
        `;

        navLinks.appendChild(userMenu);

        const trigger = userMenu.querySelector(".user-menu-trigger");
        const dropdown = userMenu.querySelector(".user-menu-dropdown");
        const logoutBtn = userMenu.querySelector(".user-menu-logout");

        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            userMenu.classList.toggle("open");
        });

        logoutBtn.addEventListener("click", () => {
            logoutUser();
        });

      
        document.addEventListener("click", (e) => {
            if (!userMenu.contains(e.target)) {
                userMenu.classList.remove("open");
            }
        });

    } else {

        const loginLink = document.createElement("a");
        loginLink.href = "/login.html";
        loginLink.textContent = "Login";
        navLinks.appendChild(loginLink);
    }
}