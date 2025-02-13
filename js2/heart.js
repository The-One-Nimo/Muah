const hearts = document.getElementsByClassName('heart');

// Function to generate random position within the viewport
function getRandomPosition() {
    const x = Math.random() * (window.innerWidth - 50); // Subtract heart width
    const y = Math.random() * (window.innerHeight - 50); // Subtract heart height
    return { x, y };
}

// Function to set the heart's position directly
function setHeartPosition(heart) {
    const { x, y } = getRandomPosition();
    heart.style.left = `${x}px`; // Set left position
    heart.style.top = `${y}px`;   // Set top position
}

// Set initial positions for all hearts
for (let i = 0; i < hearts.length; i++) {
    setHeartPosition(hearts[i]);

    // Change position on click
    hearts[i].addEventListener('click', () => {
        setHeartPosition(hearts[i]);
        hearts[i].style.transform = 'scale(1.2)'; // Slightly enlarge on click
        setTimeout(() => {
            hearts[i].style.transform = 'scale(1)'; // Return to original size
        }, 150);
    });
}
