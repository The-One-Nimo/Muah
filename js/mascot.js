/* The little mascot: hops around the counter card and chats in a bubble */
(() => {
  const mascot = document.getElementById("mascot");
  const bubble = document.getElementById("bubble");
  const text = document.getElementById("bubbleText");
  const messages = window.LOVE.messages;

  let lastIndex = -1;
  let timer;

  function say(msg) {
    bubble.classList.add("swap");
    setTimeout(() => {
      text.textContent = msg;
      bubble.classList.remove("swap");
    }, 220);
  }

  function randomMessage() {
    let i;
    do { i = Math.floor(Math.random() * messages.length); } while (messages.length > 1 && i === lastIndex);
    lastIndex = i;
    return messages[i];
  }

  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(() => { say(randomMessage()); scheduleNext(); }, 5000 + Math.random() * 5000);
  }

  function hop() {
    mascot.classList.remove("hopping");
    void mascot.offsetWidth;
    mascot.classList.add("hopping");
  }

  // Wander along the top edge of the card
  let goingLeft = false;
  function wander() {
    const narrow = window.innerWidth < 520;
    const lo = narrow ? 26 : 12, hi = narrow ? 74 : 88;
    const target = goingLeft ? lo : hi;
    goingLeft = !goingLeft;
    mascot.style.left = target + "%";
    mascot.classList.toggle("bubble-right", target < 50);
    mascot.classList.toggle("bubble-left", target >= 50);
    hop();
  }

  function interact() {
    wander();
    say(randomMessage());
    scheduleNext();
  }

  mascot.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") interact(); });
  mascot.addEventListener("click", (e) => { e.stopPropagation(); interact(); });
  mascot.addEventListener("animationend", (e) => { if (e.animationName === "hop") mascot.classList.remove("hopping"); });

  mascot.classList.add("bubble-right"); // starts on the left side
  text.textContent = `Hello ${window.LOVE.her}! ❤`;
  setTimeout(() => say(randomMessage()), 3500);
  scheduleNext();
})();
