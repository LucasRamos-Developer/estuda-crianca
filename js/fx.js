// Sons (WebAudio, sem arquivos), confete e vibração.
let ctx = null;
let enabled = true;

export function setSound(on) { enabled = on; }

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.18, slideTo = null) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  tap() { if (enabled) tone(660, 0, 0.06, 'triangle', 0.08); },
  correct() {
    if (!enabled) return;
    tone(784, 0, 0.12, 'triangle', 0.2);
    tone(1175, 0.1, 0.22, 'triangle', 0.2);
  },
  wrong() {
    if (!enabled) return;
    tone(220, 0, 0.18, 'square', 0.08, 160);
    tone(160, 0.16, 0.25, 'square', 0.08, 110);
  },
  complete() {
    if (!enabled) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, 'triangle', 0.2));
    tone(1319, 0.5, 0.5, 'triangle', 0.18);
  },
  tick() { if (enabled) tone(1000, 0, 0.04, 'sine', 0.05); },
  lose() {
    if (!enabled) return;
    [392, 330, 262].forEach((f, i) => tone(f, i * 0.18, 0.3, 'triangle', 0.15));
  },
};

export function vibrate(ms = 80) {
  try { navigator.vibrate && navigator.vibrate(ms); } catch { /* ignora */ }
}

export function confetti(duration = 2600) {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  document.body.appendChild(canvas);
  const c = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#CE82FF', '#FF9600'];
  const parts = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 80,
    y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 14 - 4,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    color: colors[(Math.random() * colors.length) | 0],
  }));
  const start = performance.now();
  function frame(now) {
    const t = now - start;
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.35;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      c.save();
      c.globalAlpha = Math.max(0, 1 - t / duration);
      c.translate(p.x, p.y);
      c.rotate(p.r);
      c.fillStyle = p.color;
      c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      c.restore();
    }
    if (t < duration) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}
