document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Encrypt email before sending it to the backend
    let encryptedEmail;
    try {
        const response = await fetch("/crypto/asymmetric/encrypt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { email } })
        });

        if (!response.ok) {
            throw new Error("Encryption failed");
        }

        const result = await response.json();
        encryptedEmail = result.encryptedData.email;
    } catch (error) {
        console.error("Error encrypting email:", error);
        alert("An error occurred. Please try again.");
        return;
    }

    // Send encrypted email and password to the backend
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: encryptedEmail, password })
        });

        if (!response.ok) {
            throw new Error("Authentication failed");
        }

        const data = await response.json();
        alert("Login successful!");
        window.location.href = "/startside";
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please check your credentials.");
    }
});
