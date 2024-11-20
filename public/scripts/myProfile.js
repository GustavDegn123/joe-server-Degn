document.addEventListener("DOMContentLoaded", () => {
    const editProfileButton = document.getElementById("edit-profile-button");
    if (editProfileButton) {
        editProfileButton.addEventListener("click", () => {
            window.location.href = "/edit-profile";
        });
    }
});

async function loadUserProfile() {
    try {
        const response = await fetch('/api/profile/my-profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Ensure cookies are sent with the request
        });

        if (!response.ok) {
            throw new Error('Failed to load profile data');
        }

        const data = await response.json();
        console.log('Fetched Profile Data:', data);

        // Populate loyalty card with data
        document.getElementById("full-name").textContent = data.name;
        document.getElementById("email").textContent = data.email;
        document.getElementById("phone-number").textContent = data.phone_number;
        document.getElementById("country").textContent = data.country;
        document.getElementById("loyalty-points").textContent = data.loyalty_points;
        document.getElementById("total-orders").textContent = data.total_orders;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}
  
  // Load the profile data when the page loads
  document.addEventListener("DOMContentLoaded", loadUserProfile);
  