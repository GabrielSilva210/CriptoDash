const heroCss = `
@keyframes hero-coin-in {
  from { opacity: 0; transform: translateX(70px) rotate(8deg); }
  to   { opacity: 1; transform: translateX(0) rotate(0); }
}
@keyframes hero-coin-float {
  from { transform: translateY(0) rotate(0deg); }
  to   { transform: translateY(-9px) rotate(-1.5deg); }
}
@keyframes hero-shadow {
  from { transform: scale(1); opacity: 0.28; }
  to   { transform: scale(0.93); opacity: 0.18; }
}
@keyframes hero-shine {
  0%, 55%  { transform: translateX(-260px) skewX(-20deg); }
  85%, 100% { transform: translateX(260px) skewX(-20deg); }
}
@keyframes hero-text-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-coin-in    { transform-origin: 0 0; animation: hero-coin-in 1s cubic-bezier(.2,.8,.2,1) both; }
.hero-coin-float { transform-origin: 0 0; animation: hero-coin-float 4.5s ease-in-out 1s infinite alternate; }
.hero-shadow     { transform-box: fill-box; transform-origin: center; animation: hero-shadow 4.5s ease-in-out 1s infinite alternate; }
.hero-shine      { animation: hero-shine 6s ease-in-out 1.5s infinite; }
.hero-text-in    { animation: hero-text-in .7s ease-out .1s both; }
@media (prefers-reduced-motion: reduce) {
  .hero-coin-in, .hero-coin-float, .hero-shadow, .hero-shine, .hero-text-in { animation: none; }
  .hero-shine { opacity: 0; }
}
`

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
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#d5dce6" />
        </linearGradient>
        <linearGradient id="hero-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#94a3b8" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="hero-corner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#134e4a" />
          <stop offset="1" stopColor="#0b1623" />
        </linearGradient>

        {/* espessura da moeda */}
        <linearGradient id="coin-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="0.5" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
        {/* aro externo */}
        <linearGradient id="coin-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="0.5" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#8794a8" />
        </linearGradient>
        {/* face */}
        <radialGradient id="coin-face" cx="0.3" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#f1f5f9" />
          <stop offset="0.55" stopColor="#c3ccd9" />
          <stop offset="1" stopColor="#8d9aae" />
        </radialGradient>
        <linearGradient id="coin-symbol" gradientUnits="userSpaceOnUse" x1="-60" y1="-70" x2="60" y2="70">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
        <clipPath id="coin-clip">
          <circle r="150" />
        </clipPath>
        <linearGradient id="shine-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="coin-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="emboss-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>

        {/* símbolo ₿ (reaproveitado na sombra e no relevo) */}
        <g
          id="btc-mark"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="17"
        >
          <path d="M -28 -56 V 56" />
          <path d="M -28 -50 H 12 C 36 -50 44 -38 44 -26 C 44 -12 32 -2 12 -2 H -28" />
          <path d="M 12 -2 H 18 C 44 -2 54 10 54 26 C 54 42 42 52 16 52 H -28" />
          <path d="M -10 -70 V -56 M 10 -70 V -56 M -10 56 V 70 M 10 56 V 70" strokeWidth="12" />
        </g>
      </defs>

      <rect width="640" height="240" fill="url(#hero-bg)" />

      {/* faixas diagonais */}
      <polygon points="330,0 520,0 400,240 210,240" fill="url(#hero-band)" />
      <polygon points="470,0 640,0 640,240 350,240" fill="url(#hero-band)" opacity="0.7" />

      {/* canto escuro inferior direito */}
      <polygon points="600,240 640,150 640,240" fill="url(#hero-corner)" />

      {/* sombra da moeda */}
      <ellipse className="hero-shadow" cx="465" cy="160" rx="150" ry="140" fill="#0f172a" opacity="0.28" filter="url(#coin-blur)" />

      {/* moeda */}
      <g transform="translate(470 128) rotate(12) scale(0.9)">
        <g className="hero-coin-in">
        <g className="hero-coin-float">
        {/* espessura: disco deslocado atrás da face */}
        <circle cx="-16" cy="9" r="150" fill="url(#coin-edge)" />
        <circle
          cx="-16"
          cy="9"
          r="146"
          fill="none"
          stroke="#0f172a"
          strokeOpacity="0.3"
          strokeWidth="5"
          strokeDasharray="2 5"
        />

        {/* aro */}
        <circle r="150" fill="url(#coin-rim)" />
        <circle r="150" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" />
        <circle r="132" fill="url(#coin-face)" />
        <circle r="132" fill="none" stroke="#0f172a" strokeOpacity="0.18" strokeWidth="2" />
        <circle r="112" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
        <circle r="108" fill="none" stroke="#0f172a" strokeOpacity="0.15" strokeWidth="2" />

        {/* ₿ em relevo: sombra, brilho e face */}
        <g transform="translate(-4 0) scale(1.15)">
          <use href="#btc-mark" stroke="#1e293b" strokeOpacity="0.45" transform="translate(3.5 5)" filter="url(#emboss-blur)" />
          <use href="#btc-mark" stroke="url(#coin-symbol)" />
          <use href="#btc-mark" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" transform="translate(-2 -3)" />
        </g>

        {/* brilho que passa pela face */}
        <g clipPath="url(#coin-clip)">
          <rect className="hero-shine" x="-30" y="-200" width="60" height="400" fill="url(#shine-grad)" />
        </g>
        </g>
        </g>
      </g>
    </svg>
  )
}

function Hero() {
  return (
    <>
    <style>{heroCss}</style>
    <section className="relative isolate h-48 overflow-hidden sm:h-56">
      <HeroArt />

      {/* véu para manter o texto legível sobre a arte */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/85 to-transparent sm:via-slate-50/60 sm:to-transparent" />

      <div className="hero-text-in relative flex h-full flex-col justify-center px-8">
        <p className="text-2xl font-bold tracking-tight text-[#0b1623] sm:text-3xl">
          Bem-vindo ao
        </p>
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-[#0b1623] sm:text-6xl">
          Cripto<span className="text-emerald-500">Dash</span>
        </h1>
        <p className="mt-3 max-w-sm text-sm text-slate-700 sm:text-base">
          Acompanhe as principais criptomoedas e fique por dentro de tudo o
          que acontece no mercado.
        </p>
      </div>
    </section>
    </>
  )
}

export default Hero