// Set the date when you met
const meetDate = new Date("2024-04-16T00:57:00"); // Update this date and time

// Function to calculate time since meet date
function calculateTime() {
  const currentDate = new Date();
  
  // Calculate years
  let years = currentDate.getFullYear() - meetDate.getFullYear();
  const monthCheck = currentDate.getMonth() - meetDate.getMonth();
  const dayCheck = currentDate.getDate() - meetDate.getDate();
  
  // Create temporary date for anniversary comparison
  const tempDate = new Date(meetDate);
  tempDate.setFullYear(currentDate.getFullYear());
  
  // Reduce year if anniversary hasn't occurred yet
  if (currentDate < tempDate) {
    years--;
  }

  // Calculate remaining time after accounting for full years
  const adjustedDate = new Date(meetDate);
  adjustedDate.setFullYear(meetDate.getFullYear() + years);
  const remainingTime = currentDate - adjustedDate;

  // Calculate days, hours, minutes, and seconds from remaining time
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  txt = ''
  if(years > 0) {
    txt = `${years} years, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
  }else if(days > 0) {    
    txt = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
  }else{
    txt = `${hours} hours, ${minutes} minutes, ${seconds} seconds`
  }
    
    // Display the result
    document.getElementById("timeCounter").textContent = txt

}

// Update the timer every second
setInterval(calculateTime, 1000);