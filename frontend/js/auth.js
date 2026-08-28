import { AUTH_API_URL } from "./config.js";
import { saveAuth, clearAuth } from "./authStorage.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        try {

            const response = await fetch(`${AUTH_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed.");
                return;
            }

            alert("Registration successful! Please login.");
            window.location.href = "/login.html";

        } catch (error) {
            console.error("Register error:", error);
            alert("Something went wrong.");
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
                alert(data.message || "Login failed.");
                return;
            }

            saveAuth(data.accessToken, data.user);
            

            alert("Login successful!");
            window.location.href = "/viewAll.html";
            alert("Login response:", data.user);

        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong.");
        }
    });
}

export async function logoutUser() {

    try {
        await fetch(`${AUTH_API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });
    } catch (error) {
        console.error("Logout error:", error);
    }

    clearAuth();
    window.location.href = "/login.html";
}