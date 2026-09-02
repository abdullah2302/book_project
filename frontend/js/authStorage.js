const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

function getCookieValue(name) {
    const cookie = document.cookie
        .split("; ")
        .find((entry) => entry.startsWith(`${name}=`));

    if (!cookie) return "";
    return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

function setCookie(name, value, maxAgeInSeconds = 7 * 24 * 60 * 60) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeInSeconds}; SameSite=Lax`;
}

function clearCookie(name) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function saveAuth(accessToken, user) {
    setCookie(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken() {
    return getCookieValue(ACCESS_TOKEN_KEY);
}

export function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export function clearAuth() {
    clearCookie(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.clear();
}

export function isLoggedIn() {
    return !!getAccessToken() && !!getUser();
}

export function isAdmin() {
    const user = getUser();
    return user?.role === "admin";
}