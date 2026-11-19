const heroCss = `
/* ---------- moeda 3D ---------- */
.coin-scene {
  --s: 150px;
  --t: calc(var(--s) * 0.1);
  position: relative;
  width: var(--s);
  height: var(--s);
  perspective: 900px;
  animation: coin-light 9s linear infinite;
}
@media (min-width: 640px) { .coin-scene { --s: 210px; } }

.coin-in, .coin-float, .coin-tilt, .coin-spin { position: absolute; inset: 0; transform-style: preserve-3d; }
.coin-in    { animation: coin-in 1.1s cubic-bezier(.2,.8,.2,1) both; }
.coin-float { animation: coin-float 4.5s ease-in-out infinite alternate; }
.coin-tilt  { transform: rotateX(16deg) rotateZ(-10deg); }
.coin-spin  { animation: coin-spin 9s ease-in-out infinite; }

/* faces */
.coin-face { position: absolute; inset: 0; backface-visibility: hidden; }
.coin-front { transform: translateZ(calc(var(--t) / 2)); }
.coin-back  { transform: rotateY(180deg) translateZ(calc(var(--t) / 2)); }
.coin-face svg { display: block; width: 100%; height: 100%; overflow: visible; }

/* parede serrilhada (cilindro feito de 72 segmentos) */
.coin-seg {
  --w: calc(var(--s) * 3.1416 / 72 + 1px);
  position: absolute;
  left: 50%; top: 50%;
  width: var(--w);
  height: calc(var(--t) + 1px);
  margin: calc((var(--t) + 1px) / -2) 0 0 calc(var(--w) / -2);
  transform: rotateZ(var(--a)) translateY(calc(var(--s) * -0.5)) rotateX(90deg);
}

/* sombra no chão, estreita quando a moeda fica de lado */
.coin-shadow {
  position: absolute;
  left: 8%; right: 8%;
  top: calc(100% + 16px);
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(15,23,42,.35), transparent);
  animation: coin-shadow 9s ease-in-out infinite;
}

/* halo e órbita */
.coin-halo {
  position: absolute; inset: -35%;
  background: radial-gradient(closest-side, rgba(16,185,129,.28), rgba(16,185,129,0) 70%);
  animation: coin-halo 3.2s ease-in-out infinite alternate;
}
.coin-orbit {
  position: absolute; inset: -26%;
  border-radius: 50%;
  border: 1.5px dashed rgba(16,185,129,.55);
  transform: rotateX(72deg) rotateZ(0deg);
  animation: coin-orbit 14s linear infinite;
}
.coin-orbit::after {
  content: ""; position: absolute; left: 50%; top: -5px;
  width: 9px; height: 9px; margin-left: -4.5px; border-radius: 50%;
  background: #10b981; box-shadow: 0 0 12px 3px rgba(16,185,129,.8);
}

/* brilho que cruza a face */
.coin-shine { animation: coin-shine 4.5s ease-in-out infinite; }

.spark { transform-box: fill-box; transform-origin: center; animation: spark 2.8s ease-in-out infinite; }

@keyframes coin-in {
  from { transform: translateX(90px) rotateZ(14deg) scale(.85); }
  to   { transform: none; }
}
@keyframes coin-float { from { transform: translateY(0); } to { transform: translateY(-10px); } }
/* gira devagar na face e rápido de lado, como uma moeda de verdade */
@keyframes coin-spin {
  0%   { transform: rotateY(0deg); }
  50%  { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}
@keyframes coin-light {
  0%, 50%, 100% { filter: brightness(1) saturate(1.05); }
  25%, 75%      { filter: brightness(.72); }
}
@keyframes coin-shadow {
  0%, 50%, 100% { transform: scaleX(1);   opacity: .9; }
  25%, 75%      { transform: scaleX(.3);  opacity: .5; }
}
@keyframes coin-halo  { from { opacity: .5; transform: scale(.92); } to { opacity: 1; transform: scale(1.05); } }
@keyframes coin-orbit { to { transform: rotateX(72deg) rotateZ(360deg); } }
@keyframes coin-shine {
  0%, 50%   { transform: translateX(-240px) skewX(-20deg); }
  80%, 100% { transform: translateX(240px)  skewX(-20deg); }
}
@keyframes spark {
  0%, 100% { opacity: 0; transform: scale(.3) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1)  rotate(45deg); }
}
@keyframes hero-text-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-text-in { animation: hero-text-in .7s ease-out .1s both; }

@media (prefers-reduced-motion: reduce) {
  .coin-scene, .coin-in, .coin-float, .coin-spin, .coin-shadow, .coin-halo,
  .coin-orbit, .coin-shine, .spark, .hero-text-in { animation: none; }
  .coin-spin  { transform: rotateY(-28deg); }
  .coin-orbit { transform: rotateX(72deg); }
  .coin-shine { opacity: 0; }
  .spark { opacity: .7; }
}
`

/* ---------- geometria gerada uma vez ---------- */
const rnd = (i) => {
  const x = Math.sin(i * 127.1) * 43758.5453
  return x - Math.floor(x)
}
const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a)]
}
const f = (n) => n.toFixed(2)

// ranhuras finas no aro
const RIDGES = Array.from({ length: 144 }, (_, i) => {
  const [x1, y1] = pt(138, i * 2.5)
  const [x2, y2] = pt(147, i * 2.5)
  return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`
}).join('')

// trilhas de circuito: arcos concêntricos com degraus e nós nas pontas
const R0 = 54
const R1 = 128
const STEP = 2.7
const NRINGS = Math.floor((R1 - R0) / STEP)
const P = (r, a) => {
  const [x, y] = pt(r, a)
  return `${f(x)} ${f(y)}`
}
const CIRCUIT = (() => {
  let d = ''
  const nodes = []
  for (let j = 0; j <= NRINGS; j++) {
    let a = rnd(j * 7 + 1) * 40
    let swept = 0
    let seed = j * 100
    while (swept < 330) {
      seed++
      const gap = 2 + rnd(seed) * 7
      const len = 30 + rnd(seed + 300) * 80
      a += gap
      swept += gap + len
      let r = R0 + j * STEP
      let cur = a
      let remaining = len
      d += `M${P(r, cur)}`
      if (rnd(seed + 600) > 0.6) {
        const first = remaining * (0.3 + rnd(seed + 700) * 0.4)
        cur += first
        remaining -= first
        d += `A${f(r)} ${f(r)} 0 0 1 ${P(r, cur)}`
        const dir = rnd(seed + 800) > 0.5 ? 1 : -1
        let r2 = r + dir * STEP
        r2 = Math.min(R1, Math.max(R0, r2))
        d += `L${P(r2, cur)}`
        r = r2
      }
      cur += remaining
      d += `A${f(r)} ${f(r)} 0 0 1 ${P(r, cur)}`
      if (rnd(seed + 1000) > 0.6) nodes.push(pt(r, cur))
      a = cur
    }
  }
  return { d, nodes }
})()

// paredes da moeda
const SEGS = Array.from({ length: 72 }, (_, i) => {
  const a = i * 5
  const light = 56 + 16 * Math.cos(((a + 45) * Math.PI) / 180) + (i % 2 ? 6 : -6)
  return { a, bg: `hsl(215 14% ${light.toFixed(1)}%)` }
})

/* defs compartilhados pelas duas faces */
function CoinDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="coin-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="0.5" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#7d8aa0" />
        </linearGradient>
        <radialGradient id="coin-face" cx="0.3" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#e6ebf2" />
          <stop offset="0.5" stopColor="#b4bfce" />
          <stop offset="1" stopColor="#7a889e" />
        </radialGradient>
        <linearGradient id="coin-symbol" gradientUnits="userSpaceOnUse" x1="-60" y1="-70" x2="60" y2="70">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#d3dbe7" />
          <stop offset="1" stopColor="#9aa8bc" />
        </linearGradient>
        <linearGradient id="shine-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="coin-clip">
          <circle r="148" />
        </clipPath>
        <filter id="emboss-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <g id="btc-body" fill="none" strokeLinejoin="miter">
          <path d="M -28 -65 V 67" />
          <path d="M -28 -50 H 12 C 36 -50 44 -38 44 -26 C 44 -12 32 -2 12 -2 H -28" />
          <path d="M 12 -2 H 18 C 44 -2 54 10 54 26 C 54 42 42 52 16 52 H -28" />
        </g>
        <g id="btc-ticks" fill="none">
          <path d="M -10 -65 V -85 M 12 -65 V -85 M -10 67 V 87 M 12 67 V 87" />
        </g>
      </defs>
    </svg>
  )
}

function BtcLayer({ stroke, opacity = 1, w = 24, filter, transform }) {
  return (
    <g stroke={stroke} strokeOpacity={opacity} filter={filter} transform={transform}>
      <use href="#btc-body" strokeWidth={w} />
      <use href="#btc-ticks" strokeWidth={w * 0.66} />
    </g>
  )
}

function CoinFace({ flip = false }) {
  return (
    <svg viewBox="-150 -150 300 300" aria-hidden="true">
      {/* aro com ranhuras */}
      <circle r="150" fill="url(#coin-rim)" />
      <circle r="150" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" />
      <path d={RIDGES} stroke="#0f172a" strokeOpacity="0.2" strokeWidth="1" />

      {/* face */}
      <circle r="134" fill="url(#coin-face)" />
      <circle r="134" fill="none" stroke="#0f172a" strokeOpacity="0.2" strokeWidth="2" />
      <circle r="131" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.2" />

      {/* trilhas de circuito gravadas */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={CIRCUIT.d} stroke="#ffffff" strokeOpacity="0.9" strokeWidth="0.8" transform="translate(-0.7 -0.7)" />
        <path d={CIRCUIT.d} stroke="#0f172a" strokeOpacity="0.55" strokeWidth="0.8" />
        {CIRCUIT.nodes.map(([x, y], i) => (
          <circle key={i} cx={f(x)} cy={f(y)} r="1.5" fill="#dfe6ef" stroke="#0f172a" strokeOpacity="0.5" strokeWidth="0.9" />
        ))}
      </g>

      {/* ₿ grosso, com bisel */}
      <g transform={`rotate(${flip ? -12 : 12}) scale(1.02) translate(-13 -1)`}>
        <BtcLayer stroke="#0f172a" opacity={0.6} w={30} filter="url(#emboss-blur)" transform="translate(5 7)" />
        <BtcLayer stroke="#475569" opacity={0.55} w={33} />
        <BtcLayer stroke="url(#coin-symbol)" w={29} />
        <BtcLayer stroke="#0f172a" opacity={0.18} w={5} transform="translate(6 6)" />
        <BtcLayer stroke="#ffffff" opacity={0.75} w={6} transform="translate(-5.5 -5.5)" />
      </g>

      {/* brilho */}
      <g clipPath="url(#coin-clip)">
        <rect className="coin-shine" x="-30" y="-200" width="60" height="400" fill="url(#shine-grad)" />
      </g>
    </svg>
  )
}

function Coin() {
  return (
    <div
      className="absolute -right-3 top-1/2 -translate-y-1/2 sm:right-14"
      aria-hidden="true"
    >
      <CoinDefs />
      <div className="coin-halo" />
      <div className="coin-scene">
        <div className="coin-orbit" />
        <div className="coin-in">
          <div className="coin-float">
            <div className="coin-tilt">
              <div className="coin-spin">
                {SEGS.map((s, i) => (
                  <div key={i} className="coin-seg" style={{ '--a': `${s.a}deg`, background: s.bg }} />
                ))}
                <div className="coin-face coin-front"><CoinFace /></div>
                <div className="coin-face coin-back"><CoinFace flip /></div>
              </div>
            </div>
          </div>
        </div>
        <div className="coin-shadow" />
      </div>
    </div>
  )
}

const SPARKS = [
  [430, 38, 1, 0],
  [585, 62, 0.7, 0.9],
  [380, 190, 0.8, 1.7],
  [610, 200, 1.1, 0.4],
  [520, 18, 0.6, 2.1],
]

function HeroArt() {
  return (
    <svg
      viewBox="0 0 640 240"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f1c2e" />
          <stop offset="1" stopColor="#1a2c44" />
        </linearGradient>
        <linearGradient id="hero-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#94a3b8" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="hero-corner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#134e4a" />
          <stop offset="1" stopColor="#0b1623" />
        </linearGradient>
        <path id="spark-star" d="M0 -10 Q0 0 10 0 Q0 0 0 10 Q0 0 -10 0 Q0 0 0 -10Z" />
      </defs>

      <rect width="640" height="240" fill="url(#hero-bg)" />
      <polygon points="330,0 520,0 400,240 210,240" fill="url(#hero-band)" />
      <polygon points="470,0 640,0 640,240 350,240" fill="url(#hero-band)" opacity="0.7" />
      <polygon points="600,240 640,150 640,240" fill="url(#hero-corner)" />

      {SPARKS.map(([x, y, s, d], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <use href="#spark-star" className="spark" fill="#10b981" style={{ animationDelay: `${d}s` }} />
        </g>
      ))}
    </svg>
  )
}

function Hero() {
  return (
    <>
      <style>{heroCss}</style>
      <section className="relative isolate h-48 overflow-hidden sm:h-56">
        <HeroArt />
        <Coin />

        {/* véu para manter o texto legível sobre a arte */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1c2e] via-[#0f1c2e]/85 to-transparent sm:via-[#0f1c2e]/60 sm:to-transparent" />

        <div className="hero-text-in relative flex h-full flex-col justify-center px-8">
          <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Bem-vindo ao
          </p>
          <h1 className="text-4xl font-extrabold leading-none tracking-tight text-white sm:text-6xl">
            Cripto<span className="text-emerald-500">Dash</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm text-slate-300 sm:text-base">
            Acompanhe as principais criptomoedas e fique por dentro de tudo o
            que acontece no mercado.
          </p>
        </div>
      </section>
    </>
  )
}

export default Hero