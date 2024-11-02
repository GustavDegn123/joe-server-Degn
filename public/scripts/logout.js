async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include' // Ensures cookies are included in the request
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
    // Attach logout function to any logout button if necessary
    const logoutButton = document.querySelector('.user-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});
