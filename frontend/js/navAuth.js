import { isLoggedIn, isAdmin, getUser } from "./authStorage.js";
import { logoutUser } from "./auth.js";

function getInitials(name) {

    if (!name) return "?";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const navLinks = document.querySelector(".nav-links");

if (navLinks) {
    const user = getUser();

    if (isLoggedIn() && user) {

        
        const displayName = user.username;
        const initials = getInitials(displayName);

        const userMenu = document.createElement("div");
        userMenu.className = "user-menu";

        userMenu.innerHTML = `
            <button type="button" class="user-menu-trigger">
                <span class="user-avatar">${initials}</span>
                
                <i class="fa-solid fa-chevron-down user-menu-arrow"></i>
            </button>

            <div class="user-menu-dropdown">
                <div class="user-menu-info">
                    <div class="user-menu-header">
                       
                        <div>
                            <p class="user-menu-name">${displayName}</p>
                            <span class="user-menu-role role-${user.role}">${user.role}</span>
                        </div>
                    </div>
                    <p class="user-menu-email">${user.email || ""}</p>
                </div>
                <button type="button" class="user-menu-logout">
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </div>
        `;

        navLinks.appendChild(userMenu);

        const trigger = userMenu.querySelector(".user-menu-trigger");
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