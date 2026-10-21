/* Live "together for" counter: years, months, days, hours, minutes, seconds */
(() => {
  const start = new Date(window.LOVE.since);
  const els = {};
  document.querySelectorAll("[data-u]").forEach((el) => (els[el.dataset.u] = el));
  const labels = {};
  document.querySelectorAll("[data-l]").forEach((el) => (labels[el.dataset.l] = el));

  const totalEl = document.getElementById("totalDays");
  const nextEl = document.getElementById("nextAnniversary");
  const DAY = 86400000;
  const pad = (n) => String(n).padStart(2, "0");
  const plural = (n, one, many) => (n === 1 ? one : many);
  const last = {};

  // Calendar-aware difference (whole months first, remainder in d/h/m/s)
  function diff(from, to) {
    if (to < from) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    let anchor = new Date(from);
    anchor.setMonth(from.getMonth() + months);
    if (anchor > to) {
      months--;
      anchor = new Date(from);
      anchor.setMonth(from.getMonth() + months);
    }
    const ms = to - anchor;
    return {
      years: Math.floor(months / 12),
      months: months % 12,
      days: Math.floor(ms / DAY),
      hours: Math.floor((ms % DAY) / 3600000),
      minutes: Math.floor((ms % 3600000) / 60000),
      seconds: Math.floor((ms % 60000) / 1000),
    };
  }

  function setValue(key, value, text) {
    if (last[key] === value) return;
    last[key] = value;
    const el = els[key];
    el.textContent = text;
    if (key === "seconds") {
      el.classList.remove("tick");
      void el.offsetWidth; // restart animation
      el.classList.add("tick");
    }
  }

  let celebrated = false;

  function update() {
    const now = new Date();
    const d = diff(start, now);

    setValue("years", d.years, String(d.years));
    setValue("months", d.months, String(d.months));
    setValue("days", d.days, String(d.days));
    setValue("hours", d.hours, pad(d.hours));
    setValue("minutes", d.minutes, pad(d.minutes));
    setValue("seconds", d.seconds, pad(d.seconds));

    labels.years.textContent = plural(d.years, "year", "years");
    labels.months.textContent = plural(d.months, "month", "months");
    labels.days.textContent = plural(d.days, "day", "days");
    labels.hours.textContent = plural(d.hours, "hour", "hours");
    labels.minutes.textContent = plural(d.minutes, "minute", "minutes");
    labels.seconds.textContent = plural(d.seconds, "second", "seconds");

    const totalDays = Math.max(0, Math.floor((now - start) / DAY));
    totalEl.textContent = `That's ${totalDays.toLocaleString()} days of us ✨`;

    // Next anniversary
    const isToday = now.getMonth() === start.getMonth() && now.getDate() === start.getDate();
    let next = new Date(now.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes());
    if (next <= now && !isToday) next.setFullYear(next.getFullYear() + 1);
    const yearsNext = next.getFullYear() - start.getFullYear();

    if (isToday) {
      nextEl.textContent = `🎉 Happy anniversary, ${window.LOVE.her}! 🎉`;
      if (!celebrated && window.Fx) {
        celebrated = true;
        for (let i = 0; i < 6; i++) {
          setTimeout(() => window.Fx.burst(Math.random() * innerWidth, innerHeight * (0.25 + Math.random() * 0.4), 22), i * 450);
        }
      }
    } else {
      const left = Math.ceil((next - now) / DAY);
      nextEl.textContent = `💍 ${left} ${plural(left, "day", "days")} until our ${yearsNext}${ordinal(yearsNext)} anniversary`;
    }
  }

  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  update();
  setInterval(update, 1000);
})();
