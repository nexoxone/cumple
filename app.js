(() => {
'use strict';

/* ================= CONFIG (edita aquí) ================= */
const NOMBRE = 'PRECIOSA';
const FOTOS = ['img/foto1.jpg', 'img/foto2.jpg', 'img/foto3.jpg', 'img/foto4.jpg'];
const MENSAJES = [
  { t: 'LO MEJOR PARA TI HOY Y SIEMPRE. ¡FELICIDADES!', p: 'Que la felicidad te acompañe siempre y que sea aún mayor de lo que ya es, porque el bien que siembras a lo largo de tu camino es maravilloso.' },
  { t: '¡QUE LA PASES DE LO MEJOR HOY!', p: 'Que cada día de este año sea un motivo para sonreír. ¡Feliz Cumpleaños!' },
  { t: 'NUNCA DEJES DE BRILLAR ★', p: 'Tu luz hace más bonito todo lo que te rodea. Sigue siendo tú, siempre.' },
  { t: 'A CELEBRAR A LO GRANDE', p: 'Hoy el universo entero se pone de fiesta por ti. Disfruta cada instante.' },
  { t: 'AMISTAD SINCERA ✦', p: 'Gracias por ser esa persona que siempre está, en los días buenos y en los difíciles.' },
  { t: 'LOGRA CADA SUEÑO', p: 'Que este nuevo año te traiga las fuerzas y las oportunidades para cumplir todo lo que sueñas.' },
];
const FRASES = [
  'FELIZ CUMPLEAÑOS', 'A CELEBRAR A LO GRANDE', 'NUNCA DEJES DE BRILLAR ★', 'AMISTAD SINCERA ✦',
  'QUE LA PASES GENIAL', 'MUCHAS FELICIDADES EN TU DÍA', 'FELIZ CUMPLE, LOGRA CADA SUEÑO',
  'DISFRUTA TU DÍA AL MÁXIMO', 'QUE TENGAS UN DÍA INCREÍBLE', 'QUE LA PASES DE LO MEJOR HOY',
  'FELIZ CUMPLEAÑOS', 'NUNCA DEJES DE BRILLAR ★', 'A CELEBRAR A LO GRANDE', 'AMISTAD SINCERA ✦',
];
document.getElementById('title').innerHTML = 'FELIZ CUMPLEAÑOS ' + NOMBRE + ' 🎂🐾';

/* ================= UTILIDADES ================= */
const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

const cv = $('scene'), cx = cv.getContext('2d');
const fwc = $('fw'), fx = fwc.getContext('2d');
let W = 0, H = 0;
function resize() {
  W = innerWidth; H = innerHeight;
  for (const c of [cv, fwc]) { c.width = W * DPR; c.height = H * DPR; }
}
addEventListener('resize', resize); resize();

const imgs = FOTOS.map(src => { const i = new Image(); i.src = src; i.ok = false; i.onload = () => i.ok = true; return i; });

/* ================= FUEGOS ARTIFICIALES (intro) ================= */
const rockets = [], sparks = [];
let nextFw = 0;
function launch() {
  const x = rnd(.08, .92) * W;
  const ty = rnd(.15, .55) * H;
  rockets.push({ x, y: H, vx: rnd(-.4, .4), vy: -Math.sqrt(2 * .06 * (H - ty)) , ty, hue: rnd(0, 360) });
}
function explode(x, y, hue) {
  const n = 70 + (Math.random() * 60 | 0);
  const multi = Math.random() < .45;
  const sp = rnd(2, 4.2);
  for (let i = 0; i < n; i++) {
    const a = TAU * i / n + rnd(-.05, .05), v = sp * rnd(.55, 1);
    sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, dec: rnd(.008, .016),
      hue: multi ? rnd(0, 360) : hue + rnd(-14, 14) });
  }
}
function drawFireworks(dt) {
  fx.setTransform(DPR, 0, 0, DPR, 0, 0);
  fx.globalCompositeOperation = 'destination-out';
  fx.fillStyle = 'rgba(0,0,0,.14)'; fx.fillRect(0, 0, W, H);
  fx.globalCompositeOperation = 'lighter';
  const k = dt * 60;
  if (performance.now() > nextFw) { launch(); if (Math.random() < .5) launch(); nextFw = performance.now() + rnd(500, 1100); }
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.x += r.vx * k; r.y += r.vy * k; r.vy += .06 * k;
    fx.fillStyle = `hsl(${r.hue},100%,75%)`; fx.fillRect(r.x, r.y, 2, 6);
    if (r.vy >= -.4 || r.y <= r.ty) { explode(r.x, r.y, r.hue); rockets.splice(i, 1); }
  }
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x += s.vx * k; s.y += s.vy * k; s.vx *= Math.pow(.972, k); s.vy = s.vy * Math.pow(.972, k) + .035 * k;
    s.life -= s.dec * k;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }
    fx.strokeStyle = `hsla(${s.hue},100%,${60 + 25 * s.life}%,${s.life})`;
    fx.lineWidth = 2; fx.beginPath(); fx.moveTo(s.x, s.y); fx.lineTo(s.x - s.vx * 2.2, s.y - s.vy * 2.2); fx.stroke();
  }
}

/* ================= TORTA NEÓN ================= */
const TIERS = [{ r: 1, h: .66, n: 10 }, { r: .76, h: .56, n: 8 }, { r: .52, h: .5, n: 6 }];
const MAG = '#ff2bd6', MAG2 = '#ff7bea';
function ell(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, Math.max(rx, .01), Math.max(ry, .01), 0, 0, TAU); }

function drawRaccoon(c, x, y, u, t) {
  c.save(); c.translate(x, y);
  // cola
  c.strokeStyle = '#d9c8e6'; c.lineWidth = u * .12; c.lineCap = 'round';
  c.beginPath(); c.moveTo(u * .16, -u * .12); c.quadraticCurveTo(u * .42, -u * .1, u * .34, -u * .46); c.stroke();
  c.strokeStyle = '#2b2236'; c.lineWidth = u * .12; c.setLineDash([u * .07, u * .07]);
  c.beginPath(); c.moveTo(u * .16, -u * .12); c.quadraticCurveTo(u * .42, -u * .1, u * .34, -u * .46); c.stroke(); c.setLineDash([]);
  // cuerpo
  c.fillStyle = '#4a3c62'; ell(c, 0, -u * .2, u * .22, u * .26); c.fill();
  c.fillStyle = '#ffb347'; ell(c, 0, -u * .16, u * .12, u * .15); c.fill();
  // cabeza
  c.fillStyle = '#6b5a85'; ell(c, 0, -u * .5, u * .2, u * .17); c.fill();
  c.fillStyle = '#6b5a85'; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * u * .16, -u * .64, u * .07, 0, TAU); c.fill(); }
  c.fillStyle = '#17121f'; ell(c, 0, -u * .5, u * .19, u * .07); c.fill();
  c.fillStyle = '#fff'; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * u * .07, -u * .5, u * .028, 0, TAU); c.fill(); }
  c.fillStyle = '#111'; c.beginPath(); c.arc(0, -u * .43, u * .03, 0, TAU); c.fill();
  // gorro
  c.fillStyle = '#ff4fa8'; c.beginPath(); c.moveTo(-u * .09, -u * .64); c.lineTo(u * .02, -u * .96); c.lineTo(u * .1, -u * .63); c.closePath(); c.fill();
  c.strokeStyle = '#ffe14d'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-u * .05, -u * .76); c.lineTo(u * .07, -u * .72); c.stroke();
  c.fillStyle = '#ffd34d'; c.beginPath(); c.arc(u * .02, -u * .97, u * .035, 0, TAU); c.fill();
  c.restore();
}

function starburst(c, x, y, size, t, seed) {
  c.save(); c.translate(x, y); c.globalCompositeOperation = 'lighter';
  const g = c.createRadialGradient(0, 0, 0, 0, 0, size * .9);
  g.addColorStop(0, 'rgba(255,240,200,.85)'); g.addColorStop(.35, 'rgba(255,200,120,.25)'); g.addColorStop(1, 'rgba(255,150,80,0)');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, size * .9, 0, TAU); c.fill();
  const n = 20;
  for (let i = 0; i < n; i++) {
    const a = TAU * i / n + t * .6 + seed;
    const L = size * (.55 + .45 * Math.abs(Math.sin(t * 7 + i * 1.7 + seed * 5)));
    c.strokeStyle = i % 3 === 0 ? '#fff' : (i % 3 === 1 ? '#ffe9a8' : '#ffc1ec');
    c.lineWidth = 1.1; c.beginPath(); c.moveTo(Math.cos(a) * size * .12, Math.sin(a) * size * .12); c.lineTo(Math.cos(a) * L, Math.sin(a) * L); c.stroke();
  }
  c.restore();
}

/* x,y = centro de la base; s = px por unidad; rot = giro; pitch = inclinación de cámara */
function drawCake(c, x, y, s, rot, pitch, t) {
  const sp = Math.sin(pitch), cp = Math.cos(pitch);
  c.save();
  c.lineJoin = 'round';
  // plato
  c.shadowColor = MAG; c.shadowBlur = 18;
  c.strokeStyle = MAG; c.lineWidth = 2; c.fillStyle = 'rgba(30,0,40,.9)';
  ell(c, x, y + .03 * s, 1.18 * s, 1.18 * s * sp); c.fill(); c.stroke();
  let yb = 0;
  const tops = [];
  TIERS.forEach((T, ti) => {
    const r = T.r * s, ry = r * sp, hh = T.h * s * cp;
    const yBot = y - yb, yTop = yBot - hh;
    c.shadowColor = MAG; c.shadowBlur = 12;
    c.fillStyle = '#0b0412'; c.strokeStyle = MAG; c.lineWidth = 2.2;
    c.beginPath(); c.moveTo(x - r, yTop); c.lineTo(x - r, yBot);
    c.ellipse(x, yBot, r, ry, 0, Math.PI, 0, true); c.lineTo(x + r, yTop); c.closePath(); c.fill(); c.stroke();
    // tapa
    c.fillStyle = '#18061f'; ell(c, x, yTop, r, ry); c.fill(); c.stroke();
    c.shadowBlur = 6; c.strokeStyle = MAG2; c.lineWidth = 1.2; ell(c, x, yTop, r * .93, ry * .93); c.stroke();
    // guirnaldas
    const N = T.n; c.strokeStyle = MAG2; c.lineWidth = 2; c.shadowBlur = 10;
    for (let k = 0; k < N; k++) {
      const a1 = rot + k * TAU / N, a2 = a1 + TAU / N;
      const s1 = Math.sin(a1), s2 = Math.sin(a2);
      if (s1 < -.05 && s2 < -.05) continue;
      const p1 = [x + Math.cos(a1) * r, yTop + Math.sin(a1) * ry], p2 = [x + Math.cos(a2) * r, yTop + Math.sin(a2) * ry];
      const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2 + hh * .62;
      c.beginPath(); c.moveTo(p1[0], p1[1]); c.quadraticCurveTo(mx, my + hh * .3, p2[0], p2[1]); c.stroke();
      if (s1 > 0) { // cuenta naranja
        c.save(); c.shadowColor = '#ff9a2b'; c.shadowBlur = 6; c.fillStyle = '#ff9a2b';
        c.beginPath(); c.arc(p1[0], p1[1] + hh * .38, Math.max(1.6, s * .028), 0, TAU); c.fill(); c.restore();
      }
    }
    // luces del borde de base
    if (ti === 0) {
      c.shadowBlur = 0; c.fillStyle = '#ffd6f6';
      for (let k = 0; k < 24; k++) {
        const a = rot + k * TAU / 24; if (Math.sin(a) < 0) continue;
        c.beginPath(); c.arc(x + Math.cos(a) * r, yBot + Math.sin(a) * ry, 1.3, 0, TAU); c.fill();
      }
    }
    tops.push({ yTop, r, ry });
    yb += T.h * s * cp;
  });
  // velas + mapache
  const top = tops[2];
  const cand = [0, 1, 2, 3].map(i => ({ a: rot + i * TAU / 4 + .5 }));
  cand.sort((p, q) => Math.sin(p.a) - Math.sin(q.a));
  const drawCandle = cd => {
    const px = x + Math.cos(cd.a) * top.r * .78, py = top.yTop + Math.sin(cd.a) * top.ry * .78;
    const h = s * .28 * cp;
    c.shadowBlur = 6; c.shadowColor = '#27d3ff';
    c.fillStyle = '#27d3ff'; c.fillRect(px - 2, py - h, 4, h);
    c.fillStyle = '#fff'; for (let j = 0; j < 3; j++) c.fillRect(px - 2, py - h + j * h / 3 + 2, 4, 1.5);
    c.shadowColor = '#ffb020'; c.shadowBlur = 10; c.fillStyle = '#ffd34d';
    const fl = 1 + .25 * Math.sin(t * 12 + cd.a * 3);
    c.beginPath(); c.ellipse(px, py - h - 3, 1.8, 3.4 * fl, 0, 0, TAU); c.fill();
  };
  cand.filter(q => Math.sin(q.a) < 0).forEach(drawCandle);
  c.shadowBlur = 0;
  drawRaccoon(c, x, top.yTop + top.ry * .15, s * 1.1, t);
  c.shadowBlur = 0;
  cand.filter(q => Math.sin(q.a) >= 0).forEach(drawCandle);
  // bengalas
  c.shadowBlur = 0;
  for (let i = 0; i < 5; i++) {
    const a = rot * 1 + i * TAU / 5 + .3;
    const rr = [.55, .85, .7, .95, .6][i] * s * (1.0), hgt = [1.38, 1.62, 1.5, 1.2, 1.45][i] * s * cp * 1.0;
    const tx = x + Math.cos(a) * rr * 1.0, ty = top.yTop - hgt + Math.sin(a) * rr * sp * .6;
    c.strokeStyle = 'rgba(210,190,220,.55)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(x + Math.cos(a) * s * .1, top.yTop - s * .35 * cp); c.lineTo(tx, ty + s * .1); c.stroke();
    starburst(c, tx, ty, s * .22, t, i * 1.3);
  }
  c.restore();
  return top.yTop;
}

/* ================= ESTADO ================= */
let state = 'intro';      // intro -> tunnel -> galaxy
let tState = 0;
let introRot = 0, introVel = .5, dragging = false, lastX = 0, lastY = 0, moved = 0;
let yawOff = 0, pitchOff = 0, zoomOff = 0, yawVel = 0;
let galaxyT = 0;

/* ---- Túnel ---- */
const tunnel = Array.from({ length: 520 }, () => ({ a: rnd(0, TAU), r: rnd(.15, 1), z: rnd(.02, 1), col: ['#ff1fa0', '#1ee3ff', '#ffe51f'][Math.random() * 3 | 0], tw: rnd(.4, 1.6) }));
function drawTunnel(dt, p) {
  cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  cx.globalCompositeOperation = 'source-over'; cx.fillStyle = 'rgba(0,0,0,.55)'; cx.fillRect(0, 0, W, H);
  const mx = W / 2, my = H / 2, R = Math.max(W, H) * .65;
  const speed = (.25 + p * .9) * dt;
  for (const q of tunnel) {
    q.z -= speed * q.tw; if (q.z <= .02) { q.z = 1; q.a = rnd(0, TAU); q.r = rnd(.15, 1); }
    const k = 1 / q.z, rad = q.r * R * Math.min(k * .12, 1.6) * (1 + (1 - q.z));
    const x = mx + Math.cos(q.a + (1 - q.z) * .9) * rad, y = my + Math.sin(q.a + (1 - q.z) * .9) * rad;
    cx.fillStyle = q.col; cx.globalAlpha = clamp(1.2 - q.z, .15, 1);
    cx.beginPath(); cx.arc(x, y, Math.max(1, 5.5 * (1 - q.z) + .8), 0, TAU); cx.fill();
  }
  cx.globalAlpha = 1;
  // "ojo" central al final
  if (p > .78) {
    const a = clamp((p - .78) / .22, 0, 1);
    cx.save(); cx.translate(mx, my); cx.globalAlpha = a; cx.shadowColor = '#ff2bd6'; cx.shadowBlur = 16;
    cx.fillStyle = '#ff7bea'; cx.beginPath(); cx.ellipse(0, 0, 13 * a + 3, 6 * a + 1.5, 0, 0, TAU); cx.fill();
    cx.fillStyle = '#fff'; cx.beginPath(); cx.ellipse(0, 0, 5, 2.3, 0, 0, TAU); cx.fill(); cx.restore();
  }
}

/* ---- Galaxia ---- */
const NG = 14000;
const gal = [];
for (let i = 0; i < NG; i++) {
  const rr = i < NG * .45 ? Math.pow(Math.random(), 1.5) * 8 : Math.pow(Math.random(), .85) * 15;
  const arm = (Math.random() * 3 | 0) * TAU / 3;
  const spin = rr * .78;
  const sc = .1 + rr * .045;
  const ang = arm + spin + rnd(-1, 1) * sc * (Math.random() < .5 ? 1 : .35);
  let col;
  const m = Math.random();
  if (rr < 3.2) col = m < .6 ? [255, 60, 210] : [255, 140, 235];
  else if (rr < 7) col = m < .45 ? [40, 225, 235] : (m < .85 ? [220, 60, 200] : [150, 90, 230]);
  else col = m < .5 ? [40, 200, 220] : (m < .8 ? [170, 70, 200] : [90, 70, 180]);
  gal.push({ r: rr, a: ang, y: rnd(-.12, .12) * (1 + rr * .06), col, sz: rnd(.5, 1.6), bright: rnd(.45, 1) });
}
// polvo cercano para el efecto de partículas grandes en primer plano
for (let i = 0; i < 700; i++) {
  const rr = rnd(4, 17);
  gal.push({ r: rr, a: rnd(0, TAU), y: rnd(-.25, .1), col: Math.random() < .5 ? [40, 225, 235] : [210, 90, 230], sz: rnd(1.4, 3), bright: rnd(.5, 1) });
}

const phrases = FRASES.slice(0, 11).map((txt, i) => ({
  txt, ring: 3.6 + (i % 5) * 1.25 + rnd(0, .5), ang: (i / 11) * TAU + rnd(-.2, .2), spd: (.05 + (i % 3) * .012) * (i % 2 ? 1 : .8), size: .34 + (i % 3) * .05, msg: i % MENSAJES.length,
}));
const medals = FOTOS.concat(FOTOS, FOTOS.slice(0, 2)).map((f, i, arr) => ({
  img: i % FOTOS.length, ring: 3.4 + (i % 4) * 1.4 + rnd(0, .6), ang: (i / arr.length) * TAU + rnd(-.3, .3), spd: .045 + (i % 3) * .01,
  rad: .36 + (i % 3) * .07, bg: ['#e8a800', '#c88a12', '#f0b400'][i % 3], msg: i % MENSAJES.length, lift: .35 + (i % 3) * .1,
}));

let cam = { yaw: 0, pitch: .9, dist: 30, f: 0 };
let hits = [];
function proj(x, y, z) {
  const cyw = Math.cos(cam.yaw), syw = Math.sin(cam.yaw);
  const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw;
  const yy = y - .9;
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const y2 = yy * cp + z1 * sp, z2 = z1 * cp - yy * sp + cam.dist;
  const k = cam.f / Math.max(z2, .3);
  return { x: W / 2 + x1 * k, y: H * .57 - y2 * k, k, z: z2 };
}

function drawGalaxy(dt, t) {
  galaxyT += dt;
  const g = galaxyT;
  const e = ease(clamp(g / 4.5, 0, 1));
  cam.f = Math.min(W, H * 1.78) * 1.05;
  cam.dist = (34 - 17 * e) + zoomOff;
  cam.pitch = clamp(1.0 - .6 * e + pitchOff, .12, 1.35);
  cam.yaw = galaxyT * .06 + yawOff;
  yawOff += yawVel * dt; yawVel *= Math.pow(.05, dt);

  cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#000'; cx.fillRect(0, 0, W, H);

  const base = proj(0, 0, 0);
  const sCake = base.k * .95;

  // resplandor central
  const gl = cx.createRadialGradient(base.x, base.y, 0, base.x, base.y, sCake * 3.6);
  gl.addColorStop(0, 'rgba(255,40,200,.55)'); gl.addColorStop(.35, 'rgba(180,30,200,.22)'); gl.addColorStop(1, 'rgba(0,0,0,0)');
  cx.save(); cx.translate(base.x, base.y); cx.scale(1, Math.sin(cam.pitch) * .95 + .05); cx.translate(-base.x, -base.y);
  cx.fillStyle = gl; cx.beginPath(); cx.arc(base.x, base.y, sCake * 3.6, 0, TAU); cx.fill(); cx.restore();

  // disco magenta + domo morado bajo la torta
  cx.save(); cx.translate(base.x, base.y + sCake * .05); cx.scale(1, Math.sin(cam.pitch) * .9 + .1);
  const dg = cx.createRadialGradient(0, 0, 0, 0, 0, sCake * 1.9);
  dg.addColorStop(0, 'rgba(255,40,190,.95)'); dg.addColorStop(.55, 'rgba(255,40,190,.55)'); dg.addColorStop(1, 'rgba(255,40,190,0)');
  cx.fillStyle = dg; cx.beginPath(); cx.arc(0, 0, sCake * 1.9, 0, TAU); cx.fill(); cx.restore();
  cx.save(); const dm = cx.createRadialGradient(base.x - sCake * .1, base.y + sCake * .1, 0, base.x, base.y + sCake * .25, sCake * .6);
  dm.addColorStop(0, '#a77bff'); dm.addColorStop(1, '#4a1fa8'); cx.fillStyle = dm;
  cx.beginPath(); cx.ellipse(base.x, base.y + sCake * .28, sCake * .55, sCake * .42, 0, 0, TAU); cx.fill(); cx.restore();

  // partículas de la galaxia
  cx.globalCompositeOperation = 'lighter';
  const grow = ease(clamp(g / 3.2, 0, 1));
  for (let i = 0; i < gal.length; i++) {
    const p = gal[i];
    const a = p.a + g * (.22 / (.6 + p.r * .35));
    const rr = p.r * (.35 + .65 * grow);
    const q = proj(Math.cos(a) * rr, p.y, Math.sin(a) * rr);
    if (q.z < .5 || q.x < -20 || q.x > W + 20 || q.y < -20 || q.y > H + 20) continue;
    const sz = clamp(p.sz * q.k * .035, .6, 6);
    const tw = .75 + .25 * Math.sin(g * 2 + i);
    cx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.bright * tw * (p.r < 3 ? 1 : .85)})`;
    cx.fillRect(q.x - sz / 2, q.y - sz / 2, sz, sz);
  }
  cx.globalCompositeOperation = 'source-over';

  // elementos (frases y medallones) ordenados por profundidad
  const items = [];
  hits = [];
  for (const f of phrases) {
    f.ang += f.spd * dt * .6;
    const P = [Math.cos(f.ang) * f.ring, .06, Math.sin(f.ang) * f.ring];
    const pr = proj(...P); items.push({ type: 'p', o: f, P, z: pr.z });
  }
  for (const m of medals) {
    m.ang += m.spd * dt * .6;
    const P = [Math.cos(m.ang) * m.ring, m.lift, Math.sin(m.ang) * m.ring];
    const pr = proj(...P); items.push({ type: 'm', o: m, P, z: pr.z });
  }
  items.push({ type: 'cake', z: base.z });
  items.sort((a, b) => b.z - a.z);

  for (const it of items) {
    if (it.type === 'cake') { drawCake(cx, base.x, base.y, sCake, g * .35, cam.pitch, t); continue; }
    if (it.type === 'p') drawPhrase(it, g); else drawMedal(it, g);
  }
  // fundido de entrada del título
}

function drawPhrase(it, g) {
  const f = it.o, P = it.P;
  const tx = -Math.sin(f.ang), tz = Math.cos(f.ang);     // tangente
  const p0 = proj(...P);
  let T = [tx, tz];
  let p1 = proj(P[0] + T[0], P[1], P[2] + T[1]);
  if (p1.x < p0.x) { T = [-tx, -tz]; p1 = proj(P[0] + T[0], P[1], P[2] + T[1]); }
  let N = [-T[1], T[0]];
  let pn = proj(P[0] + N[0], P[1], P[2] + N[1]);
  let a = p1.x - p0.x, b = p1.y - p0.y, c = -(pn.x - p0.x), d = -(pn.y - p0.y);
  if (a * d - b * c < 0) { N = [-N[0], -N[1]]; pn = proj(P[0] + N[0], P[1], P[2] + N[1]); c = -(pn.x - p0.x); d = -(pn.y - p0.y); }
  if (p0.z < 1.2) return;
  const sc = f.size * .02;
  const edge = clamp((p0.z - 1.5) / 3, 0, 1);
  cx.save();
  cx.setTransform(a * sc * DPR, b * sc * DPR, c * sc * DPR, d * sc * DPR, p0.x * DPR, p0.y * DPR);
  cx.font = '700 40px "Share Tech Mono", "Courier New", monospace';
  cx.textAlign = 'center'; cx.textBaseline = 'middle';
  cx.globalAlpha = edge * .96;
  cx.shadowColor = '#22d8ff'; cx.shadowBlur = clamp(p0.k * .2, 4, 22);
  cx.fillStyle = '#7ff2ff'; cx.fillText(f.txt, 0, 0);
  cx.shadowBlur = 0; cx.fillStyle = '#e8ffff'; cx.globalAlpha = edge * .85; cx.fillText(f.txt, 0, 0);
  cx.restore();
  const w = cx.measureText ? f.txt.length * 22 * f.size * .02 * Math.hypot(a, b) : 40;
  hits.push({ x: p0.x, y: p0.y, r: Math.max(22, w * .55), z: p0.z, msg: f.msg, img: f.msg % FOTOS.length });
}

function drawMedal(it, g) {
  const m = it.o, p0 = proj(...it.P);
  if (p0.z < 1.2) return;
  const r = m.rad * p0.k, ry = r * (.8 + .2 * Math.sin(cam.pitch));
  cx.save();
  cx.globalAlpha = clamp((p0.z - 1.5) / 3, 0, 1);
  cx.shadowColor = 'rgba(255,170,0,.55)'; cx.shadowBlur = clamp(r * .25, 4, 24);
  cx.beginPath(); cx.ellipse(p0.x, p0.y, r, ry, -.12, 0, TAU); cx.fillStyle = m.bg; cx.fill();
  cx.shadowBlur = 0; cx.clip();
  const im = imgs[m.img];
  if (im.ok) {
    const ar = im.width / im.height, h = ry * 2, w = h * ar;
    cx.drawImage(im, p0.x - Math.max(w, r * 2) / 2, p0.y - ry, Math.max(w, r * 2), h);
  } else {
    cx.font = `${r * 1.2}px serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('🦝', p0.x, p0.y);
  }
  cx.restore();
  hits.push({ x: p0.x, y: p0.y, r: Math.max(r, ry), z: p0.z, msg: m.msg, img: m.img, medal: true });
}

/* ================= MODAL ================= */
const modal = $('modal');
function openModal(h) {
  const m = MENSAJES[h.msg];
  $('mTitle').textContent = m.t; $('mText').textContent = m.p; $('mImg').src = FOTOS[h.img];
  modal.classList.remove('hidden');
}
$('mClose').addEventListener('click', () => modal.classList.add('hidden'));
addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.add('hidden'); });
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

/* ================= INTERACCIÓN ================= */
cv.addEventListener('pointerdown', e => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; cv.classList.add('drag'); cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
  if (state === 'intro') { introRot += dx * .012; introVel = dx * .012 * 60 * .5; }
  else if (state === 'galaxy') { yawOff -= dx * .006; yawVel = -dx * .006 * 30; pitchOff = clamp(pitchOff + dy * .004, -.6, .7); }
});
cv.addEventListener('pointerup', e => {
  dragging = false; cv.classList.remove('drag');
  if (state === 'galaxy' && moved < 6) {
    let best = null;
    for (const h of hits) { const d = Math.hypot(h.x - e.clientX, h.y - e.clientY); if (d <= h.r && (!best || h.z < best.z)) best = h; }
    if (best) openModal(best);
  }
});
cv.addEventListener('wheel', e => { if (state === 'galaxy') { zoomOff = clamp(zoomOff + e.deltaY * .01, -8, 14); e.preventDefault(); } }, { passive: false });

$('btnFull').addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  else document.exitFullscreen();
});

/* ================= MÚSICA (melodía generada, sin archivos) ================= */
let ac = null, musicOn = false, melodyTimer = null, master = null;
const NOTES = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
const SONG = [['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2], ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1], ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2.5]];
function playSong() {
  if (!ac || !musicOn) return;
  let t = ac.currentTime + .05; const beat = .46;
  for (const [n, d] of SONG) {
    const o = ac.createOscillator(), o2 = ac.createOscillator(), gn = ac.createGain();
    o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = NOTES[n]; o2.frequency.value = NOTES[n] * 2;
    gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.2, t + .02); gn.gain.exponentialRampToValueAtTime(.001, t + d * beat * .95);
    o.connect(gn); o2.connect(gn); gn.connect(master); o.start(t); o2.start(t); o.stop(t + d * beat); o2.stop(t + d * beat); t += d * beat;
  }
  melodyTimer = setTimeout(playSong, (t - ac.currentTime + 1.2) * 1000);
}
function setMusic(on) {
  if (on) {
    if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = .35;
      const dl = ac.createDelay(); dl.delayTime.value = .28; const fb = ac.createGain(); fb.gain.value = .3;
      master.connect(ac.destination); master.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(ac.destination); }
    ac.resume(); musicOn = true; playSong();
  } else { musicOn = false; clearTimeout(melodyTimer); if (ac) ac.suspend(); }
  const b = $('btnMusic'); b.classList.toggle('playing', on); b.textContent = on ? '❚❚' : '♫';
}
$('btnMusic').addEventListener('click', () => setMusic(!musicOn));

/* ================= FLUJO ================= */
$('btnStart').addEventListener('click', () => {
  if (state !== 'intro') return;
  state = 'tunnel'; tState = 0;
  $('intro').classList.add('fade');
  fwc.style.transition = 'opacity .6s'; fwc.style.opacity = 0;
  setMusic(true);
  cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.fillStyle = '#000'; cx.fillRect(0, 0, W, H);
});

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, .05); last = now;
  const t = now / 1000;
  if (state === 'intro') {
    drawFireworks(dt);
    if (!dragging) { introRot += introVel * dt; introVel += (.5 - introVel) * Math.min(1, dt * 1.5); }
    cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.clearRect(0, 0, W, H);
    const s = H * .125;
    drawCake(cx, W / 2, H * .655, s, introRot, .29, t);
  } else if (state === 'tunnel') {
    tState += dt; const p = clamp(tState / 3.2, 0, 1);
    drawFireworks(dt);
    drawTunnel(dt, p);
    if (p >= 1) { state = 'galaxy'; galaxyT = 0; $('title').classList.remove('hidden'); fx.clearRect(0, 0, W, H); }
  } else {
    drawGalaxy(dt, t);
  }
  requestAnimationFrame(loop);
}
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(loop));
})();
