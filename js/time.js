// Set the date when you met
const meetDate = new Date("2024-04-16T12:57:00"); // Update this date and time

// Function to calculate time since meet date
function calculateTime() {
  const currentDate = new Date();
  const timeDiff = currentDate - meetDate;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  // Display the result
  document.getElementById("timeCounter").textContent =
    `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

// Update the timer every second
setInterval(calculateTime, 1000);
