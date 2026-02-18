const players = document.querySelectorAll(".player");

players.forEach(player => {
    player.addEventListener("play", () => {
        players.forEach(other => {
            if (other !== player) {
                other.pause();
            }
        });
    });
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent actual form submission
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Fake login check
    if(email === "test@example.com" && password === "1234") {
        window.location.href = "home.html"; // redirect to home
    } else {
        alert("Invalid email or password!");
    }
});

