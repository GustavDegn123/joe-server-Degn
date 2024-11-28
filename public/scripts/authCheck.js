// Utility to get a cookie by name
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArr = decodedCookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
            return cookie.substring((name + "=").length, cookie.length);
        }
    }
    return null;
}

// Check if JWT exists; if not, redirect to login
function ensureAuthenticated() {
    const jwt = getCookie("jwt");
    if (!jwt) {
        console.log("JWT not found. Redirecting to login page.");
        window.location.href = "/login"; // Adjust to your login page path
    }
}

// Call `ensureAuthenticated` when the script is loaded
document.addEventListener("DOMContentLoaded", ensureAuthenticated);
