/* Page glue: names, reason cards, gallery, scroll reveal, letter, rain toggle */
(() => {
  const L = window.LOVE;
  const $ = (s) => document.querySelector(s);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ----- names ----- */
  $("#herName").textContent = L.her;
  $("#herName2").textContent = L.her;
  $("#himName").textContent = L.him;
  $("#dear").textContent = `My dearest ${L.her},`;
  document.title = `For ${L.her} ♡ from ${L.him}`;

  /* ----- reasons ----- */
  const grid = $("#reasonGrid");
  L.reasons.forEach((r, i) => {
    const el = document.createElement("div");
    el.className = "card reveal";
    el.style.setProperty("--i", i);
    el.innerHTML = `<div class="icon" aria-hidden="true"></div><h3></h3><p></p>`;
    el.querySelector(".icon").textContent = r.icon;
    el.querySelector("h3").textContent = r.title;
    el.querySelector("p").textContent = r.text;
    grid.appendChild(el);
  });

  /* ----- gallery (hidden until there are photos) ----- */
  if (L.photos && L.photos.length) {
    $("#gallery").hidden = false;
    const wrap = $("#polaroids");
    const tilts = [-4, 3, -2, 4, -3, 2];
    L.photos.forEach((p, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid reveal";
      fig.style.setProperty("--r", `${tilts[i % tilts.length]}deg`);
      fig.style.setProperty("--i", i);
      const ph = document.createElement("div");
      ph.className = "ph";
      const img = document.createElement("img");
      img.src = p.src;
      img.alt = p.caption || "A memory of us";
      img.loading = "lazy";
      img.addEventListener("error", () => img.remove());
      ph.appendChild(img);
      const cap = document.createElement("figcaption");
      cap.textContent = p.caption || "";
      fig.append(ph, cap);
      wrap.appendChild(fig);
    });
  }

  /* ----- scroll reveal ----- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (el.closest(".hero")) el.style.setProperty("--i", el.style.getPropertyValue("--i") || i);
    io.observe(el);
  });

  /* ----- letter typewriter ----- */
  const body = $("#letterBody");
  const sig = $("#signature");
  sig.textContent = L.signature || "";

  async function typeLetter() {
    if (reduce) {
      L.letter.forEach((t) => { const p = document.createElement("p"); p.textContent = t; body.appendChild(p); });
      sig.classList.add("show");
      return;
    }
    // Build all paragraphs first (invisible remainder keeps the height stable)
    const parts = L.letter.map((t) => {
      const p = document.createElement("p");
      const typed = document.createElement("span");
      const rest = document.createElement("span");
      typed.className = "typed";
      rest.className = "rest";
      rest.textContent = t;
      p.append(typed, rest);
      body.appendChild(p);
      return { p, typed, rest, text: t };
    });
    for (const part of parts) {
      part.p.classList.add("typing");
      for (let i = 1; i <= part.text.length; i++) {
        part.typed.textContent = part.text.slice(0, i);
        part.rest.textContent = part.text.slice(i);
        const ch = part.text[i - 1];
        await sleep(/[.,!?]/.test(ch) ? 180 : 28);
      }
      part.p.classList.remove("typing");
      await sleep(350);
    }
    sig.classList.add("show");
    if (window.Fx) window.Fx.burst(innerWidth / 2, innerHeight * 0.6, 24);
  }

  let typed = false;
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting && !typed) { typed = true; obs.disconnect(); typeLetter(); }
  }, { threshold: 0.35 }).observe($("#paper"));

  /* ----- blood rain toggle ----- */
  const rainBtn = $("#rainBtn");
  rainBtn.addEventListener("click", () => {
    const on = rainBtn.getAttribute("aria-pressed") !== "true";
    rainBtn.setAttribute("aria-pressed", String(on));
    document.body.classList.toggle("blood", on);
    window.Fx.setMode(on ? "rain" : "petals");
  });
})();
