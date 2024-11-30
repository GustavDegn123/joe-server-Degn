// Function to handle saving the profile updates
async function saveProfile() {
    // Get values from input fields
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone_number = document.getElementById("phone").value;
    const country = document.getElementById("country").value;
    const password = document.getElementById("password").value;

    // Create an object to hold the updates
    const updatedData = {};

    // Only add fields to the object if they are filled in
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone_number) updatedData.phone_number = phone_number;
    if (country) updatedData.country = country;
    if (password) updatedData.password = password;

    // If there is nothing to update, alert the user and stop the function
    if (Object.keys(updatedData).length === 0) {
        alert('Please fill in at least one field to update your profile.');
        return;
    }

    try {
        // Send a PUT request to update the profile
        const response = await fetch('/api/profile/edit-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        // Check if the update was successful
        if (response.ok) {
            alert('Profile updated successfully!');
            window.location.href = "/startside";
        } else {
            const data = await response.json();
            alert(data.message || 'Error updating profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}
