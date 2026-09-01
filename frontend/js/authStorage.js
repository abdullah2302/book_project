const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export function saveAuth(accessToken, user) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getUser() {
    try {
        const user = sessionStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;   
    }
}

export function clearAuth() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.clear();
}

export function isLoggedIn() {
    return !!getAccessToken() && !!getUser();
}

export function isAdmin() {
    const user = getUser();
    return user?.role === "admin";
}