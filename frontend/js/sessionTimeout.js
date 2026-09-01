import { getAccessToken, clearAuth } from "./authStorage.js";
import { AUTH_API_URL } from "./config.js";
import { confirmToast } from "./toast.js";

let warningTimer = null;

function getTokenExpiry(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000;
    } catch {
        return null;
    }
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
    clearAuth();
    showSessionExpiredMessage();
}

export function startSessionTimers(token = getAccessToken()) {

    clearTimeout(warningTimer);

    if (!token) return;

    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) return;

    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    if (timeUntilExpiry <= 0) {
        handleSessionExpired();
        return;
    }

    // Expiry se 1 minute pehle warning dikhao
    const warningTime = Math.max(timeUntilExpiry - 60000, 0);

    warningTimer = setTimeout(() => {

        confirmToast("Your session is about to expire. Stay logged in?", {
            countdown: 60,
            onExpire: () => {
                clearAuth();
                window.location.href = "/login.html";
            }
        }).then((confirmed) => {

            if (confirmed) {
                tryRefreshSession();
            } else {
                clearAuth();
                window.location.href = "/login.html";
            }
        });

    }, warningTime);
}

const currentToken = getAccessToken();
if (currentToken) {
    startSessionTimers(currentToken);
}