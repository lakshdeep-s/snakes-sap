document.getElementById("signup-button").addEventListener("click", async() => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageDiv = document.getElementById("message");

    try {
        const response = await fetch("/auth/signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, email, password})
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
        }
    } catch(err) {
        console.log(err);
        messageDiv.style.color = "yellow";
        messageDiv.innerHTML = result.message;
    }
})