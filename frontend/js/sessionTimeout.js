import { getAccessToken, clearAuth } from "./authStorage.js";
import { AUTH_API_URL } from "./config.js";

let warningTimer = null;
let logoutTimer = null;


function getTokenExpiry(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000; 
    } catch {
        return null;
    }
}

function showSessionWarning(onStayLoggedIn, onLogout) {

    const existing = document.getElementById("sessionWarningOverlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "sessionWarningOverlay";
    overlay.className = "confirm-toast-overlay";

    overlay.innerHTML = `
        <div class="confirm-toast">
            <div class="confirm-toast-icon">
                <i class="fa-solid fa-clock"></i>
            </div>
            <p class="confirm-toast-message">
                Your session is about to expire. Do you want to stay logged in?
            </p>
            <div class="confirm-toast-actions">
                <button type="button" class="confirm-btn-cancel" id="sessionLogoutBtn">Logout</button>
                <button type="button" class="confirm-btn-yes" id="sessionStayBtn">Stay Logged In</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));

    function close() {
        overlay.classList.remove("show");
        setTimeout(() => overlay.remove(), 250);
    }

    document.getElementById("sessionStayBtn").addEventListener("click", () => {
        close();
        onStayLoggedIn();
    });

    document.getElementById("sessionLogoutBtn").addEventListener("click", () => {
        close();
        onLogout();
    });
}

function showSessionExpiredMessage() {

    const overlay = document.createElement("div");
    overlay.id = "sessionExpiredOverlay";
    overlay.className = "confirm-toast-overlay show";

    overlay.innerHTML = `
        <div class="confirm-toast">
            <div class="confirm-toast-icon session-expired-icon">
                <i class="fa-solid fa-lock"></i>
            </div>
            <p class="confirm-toast-message">
                Your session has expired for security reasons. Please login again.
            </p>
            <div class="confirm-toast-actions">
                <button type="button" class="confirm-btn-yes" id="sessionExpiredOkBtn">Go to Login</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("sessionExpiredOkBtn").addEventListener("click", () => {
        window.location.href = "/login.html";
    });
}

async function tryRefreshSession() {

    try {
        const response = await fetch(`${AUTH_API_URL}/refresh`, {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            handleSessionExpired();
            return;
        }

        const data = await response.json();

        if (!data.accessToken) {
            handleSessionExpired();
            return;
        }

        sessionStorage.setItem("accessToken", data.accessToken);
        startSessionTimers(data.accessToken);

    } catch {
        handleSessionExpired();
    }
}

function handleSessionExpired() {
    clearTimeout(warningTimer);
    clearTimeout(logoutTimer);
    clearAuth();
    showSessionExpiredMessage();
}

export function startSessionTimers(token = getAccessToken()) {

    clearTimeout(warningTimer);
    clearTimeout(logoutTimer);

    if (!token) return;

    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) return;

    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    if (timeUntilExpiry <= 0) {
        handleSessionExpired();
        return;
    }

   
    const warningTime = Math.max(timeUntilExpiry - 60000, 0);

    warningTimer = setTimeout(() => {
        showSessionWarning(
            () => tryRefreshSession(),      // Stay logged in
            () => {                          // Logout
                clearAuth();
                window.location.href = "/login.html";
            }
        );
    }, warningTime);

    logoutTimer = setTimeout(() => {
        handleSessionExpired();
    }, timeUntilExpiry);
}


const currentToken = getAccessToken();
if (currentToken) {
    startSessionTimers(currentToken);
}