import { AUTH_API_URL } from "./config.js";
import { getAccessToken, saveAuth, getUser, clearAuth } from "./authStorage.js";

async function refreshAccessToken() {
    try {

        const response = await fetch(`${AUTH_API_URL}/refresh`, {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            clearAuth();
            return null;
        }

        const data = await response.json();
        saveAuth(data.accessToken, getUser());

        return data.accessToken;

    } catch (error) {
        clearAuth();
        return null;
    }
}


export async function apiRequest(url, options = {}) {

    let accessToken = getAccessToken();

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : ""
        },
        credentials: "include"
    });

    
    if (response.status === 401) {

        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
            window.location.href = "/login.html";
            return response;
        }

        // Naye token ke sath dobara try karo
        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${newAccessToken}`
            },
            credentials: "include"
        });
    }

    return response;
}