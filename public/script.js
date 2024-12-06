document.getElementById("registrationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const event = document.getElementById("event").value;

    try {
        const res = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, event }),
        });

        const data = await res.json();
        document.getElementById("responseMessage").textContent = data.message;

        if (res.ok) {
            document.getElementById("registrationForm").reset();
        }
    } catch (err) {
        document.getElementById("responseMessage").textContent = "Error registering.";
    }
});
