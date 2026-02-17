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

