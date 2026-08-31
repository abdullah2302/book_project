import { AUTH_API_URL } from "./config.js";
import { saveAuth, clearAuth } from "./authStorage.js";
import { showToast } from "./toast.js";
import{startSessionTimers} from "./sessionTimeout.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();
        console.log("Form submitted");
        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const role = document.getElementById("registerRole").value;

        try {

            const response = await fetch(`${AUTH_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, role })
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.message || "Registration failed.", "error");
                return;
            }

            showToast("Registration successful! Please login.", "success");
            window.location.href = "/login.html";

        } catch (error) {
            console.error("Register error:", error);
            showToast("Something went wrong.", "error");
        }
    });
}

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {

            const response = await fetch(`${AUTH_API_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.message || "Login failed.", "error");
                return;
            }
             
            saveAuth(data.accessToken, data.user);
            startSessionTimers(data.accessToken);

            showToast("Login successful!", "success");
            window.location.href = "/viewAll.html";


        } catch (error) {
            console.error("Login error:", error);
            showToast("Something went wrong.", "error");
        }
    });
}

export async function logoutUser() {

    try {
        let response = await fetch(`${AUTH_API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });
        const data = await response.json();
        if (!response.ok) {

            showToast(data.message || "Logout failed.", "error");
        }

        showToast("Logout successful!", "success");


    } catch (error) {
        console.error("Logout error:", error);
    }

    clearAuth();
    window.location.href = "/login.html";
}