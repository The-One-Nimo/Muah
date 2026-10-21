/* Stars, falling petals & hearts, blood rain, tap-to-burst hearts, sparkle trail */
(() => {
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, DPR = 1;
  let mode = "petals"; // "petals" | "rain"
  let stars = [], petals = [], drops = [];
  const bursts = [];
  const sparkles = [];

  const rand = (a, b) => a + Math.random() * (b - a);
  const PINKS = ["#ff9ab8", "#ff7aa2", "#ffc2d6", "#ffd9a8", "#ff5f93", "#ffffff"];

  /* ---------- shapes ---------- */
  function heartPath(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.1, x - s * 0.6, y - s * 0.1, x - s * 0.6, y + s * 0.3);
    ctx.bezierCurveTo(x - s * 0.6, y + s * 0.65, x - s * 0.1, y + s * 0.8, x, y + s);
    ctx.bezierCurveTo(x + s * 0.1, y + s * 0.8, x + s * 0.6, y + s * 0.65, x + s * 0.6, y + s * 0.3);
    ctx.bezierCurveTo(x + s * 0.6, y - s * 0.1, x, y - s * 0.1, x, y + s * 0.3);
    ctx.closePath();
  }

  function sparklePath(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r);
    ctx.closePath();
  }

  /* ---------- seeding ---------- */
  function makePetal(initial) {
    const heart = Math.random() < 0.28;
    return {
      x: rand(0, W),
      y: initial ? rand(-H * 0.1, H) : rand(-60, -10),
      vy: rand(0.5, 1.5),
      vx: rand(-0.25, 0.25),
      size: heart ? rand(7, 13) : rand(8, 15),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.03, 0.03),
      sway: rand(0.4, 1.2),
      phase: rand(0, Math.PI * 2),
      heart,
      color: PINKS[Math.floor(Math.random() * PINKS.length)],
      alpha: rand(0.45, 0.9),
    };
  }

  function makeDrop(initial) {
    return {
      x: rand(0, W),
      y: initial ? rand(-H, H) : rand(-H * 0.3, -10),
      len: rand(10, 22),
      speed: rand(9, 17),
    };
  }

  function seed() {
    const area = W * H;
    const starCount = Math.min(220, Math.floor(area / 7000));
    stars = Array.from({ length: starCount }, () => ({
      x: rand(0, W), y: rand(0, H * 0.85), r: rand(0.4, 1.5),
      speed: rand(0.6, 2.2), phase: rand(0, Math.PI * 2),
    }));
    const petalCount = Math.round(Math.min(60, Math.max(22, W / 20)) * (reduce ? 0.4 : 1));
    petals = Array.from({ length: petalCount }, () => makePetal(true));
    drops = Array.from({ length: Math.round(Math.min(160, W / 8)) }, () => makeDrop(true));
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  }

  /* ---------- drawing ---------- */
  function drawStars(t) {
    ctx.fillStyle = "#fff";
    for (const s of stars) {
      ctx.globalAlpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawPetals(t, k) {
    for (const p of petals) {
      p.y += p.vy * k;
      p.x += (p.vx + Math.sin(t * 0.0015 * p.sway + p.phase) * 0.5) * k;
      p.rot += p.vr * k;
      if (p.y > H + 30 || p.x < -40 || p.x > W + 40) Object.assign(p, makePetal(false));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      if (p.heart) {
        heartPath(0, -p.size / 2, p.size);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.ellipse(-p.size * 0.1, -p.size * 0.2, p.size * 0.12, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function drawRain(k) {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(205, 25, 45, 0.7)";
    ctx.beginPath();
    for (const d of drops) {
      d.y += d.speed * k;
      if (d.y > H + 20) Object.assign(d, makeDrop(false), { x: rand(0, W) });
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1.5, d.y + d.len);
    }
    ctx.stroke();
  }

  function drawBursts(k) {
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.vy += 0.1 * k;
      b.x += b.vx * k;
      b.y += b.vy * k;
      b.rot += b.vr * k;
      b.life -= k;
      if (b.life <= 0) { bursts.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.globalAlpha = Math.min(1, b.life / 30);
      ctx.fillStyle = b.color;
      heartPath(0, -b.size / 2, b.size);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function drawSparkles(k) {
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.life -= k;
      s.y += 0.4 * k;
      if (s.life <= 0) { sparkles.splice(i, 1); continue; }
      ctx.globalAlpha = s.life / s.max;
      ctx.fillStyle = s.color;
      sparklePath(s.x, s.y, s.size * (s.life / s.max + 0.3));
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- loop ---------- */
  let last = performance.now();
  function frame(t) {
    const k = Math.min((t - last) / 16.67, 3);
    last = t;
    ctx.clearRect(0, 0, W, H);
    drawStars(t);
    if (mode === "rain") drawRain(k); else drawPetals(t, k);
    drawBursts(k);
    drawSparkles(k);
    if (!document.hidden) requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) { last = performance.now(); requestAnimationFrame(frame); }
  });

  /* ---------- interaction ---------- */
  function burst(x, y, count = 16) {
    if (reduce) count = 6;
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(1.5, 5.5);
      bursts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2.2,
        size: rand(9, 20), rot: rand(-0.5, 0.5), vr: rand(-0.08, 0.08),
        life: rand(55, 95), color: PINKS[Math.floor(Math.random() * PINKS.length)],
      });
    }
  }

  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;
    burst(e.clientX, e.clientY);
  });

  let lastSpark = 0;
  window.addEventListener("pointermove", (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const now = performance.now();
    if (now - lastSpark < 35) return;
    lastSpark = now;
    sparkles.push({
      x: e.clientX + rand(-6, 6), y: e.clientY + rand(-6, 6),
      size: rand(3, 7), life: 38, max: 38,
      color: Math.random() < 0.5 ? "#ffd9a8" : "#ff9ab8",
    });
  });

  window.addEventListener("resize", resize);

  window.Fx = {
    burst,
    setMode(m) { mode = m === "rain" ? "rain" : "petals"; },
    getMode() { return mode; },
  };

  resize();
  requestAnimationFrame(frame);
})();
