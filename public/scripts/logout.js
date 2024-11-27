async function logout() {
    try {
        // Clear all cookies explicitly
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        }

        // Make logout request to the server
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include', // Ensures cookies are included in the request
        });

        if (response.ok) {
            // Redirect to login page after logout
            window.location.href = '/login';
        } else {
            console.error('Failed to log out');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach logout function to the logout button
    const logoutButton = document.querySelector('.user-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});
