document.getElementById("login-button").addEventListener("click", async() => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageDiv = document.getElementById("message");

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        })

        const result = await response.json();
        
        if (!response.ok) {
            messageDiv.innerHTML = result.message;
            messageDiv.style.backgroundColor = "red";
            messageDiv.style.color = "white";
        } else {
            messageDiv.innerHTML = result.message;
            messageDiv.style.backgroundColor = "green";
            messageDiv.style.color = "white"
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);

            window.location.href = '/dashboard'
        }
    } catch(err) {
        console.log(err);
        messageDiv.style.color = "yellow";
        messageDiv.innerHTML = err;
    }
})

const scheduleTokenRefresh = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    // Split the JWT token parts (header, payload, signature)
    const [, payloadBase64] = accessToken.split('.');
    const payload = JSON.parse(atob(payloadBase64));

    const exp = payload.exp; // Expiration time in seconds

    if (!exp) {
        console.error("Invalid access token format or expiration");
        return;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    const timeUntilRefresh = (exp * 1000) - (currentTime * 1000) - (60 * 1000); // Refresh 1 minute before expiry

    setTimeout(refreshToken, timeUntilRefresh);
};


const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.error("Refresh Token not found");
            return;
        }

        const response = await fetch("/auth/refresh-token", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('accessToken', result.accessToken);
            scheduleTokenRefresh();
        } else {
            console.error("Failed to refresh token:", result.message);
        }
    } catch (err) {
        console.error("Error refreshing token:", err);
    }
};