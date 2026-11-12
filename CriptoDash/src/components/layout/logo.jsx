import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="mb-8 flex items-center gap-2 px-2">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7 text-emerald-400"
        aria-hidden="true"
      >
        <rect x="2"   y="14" width="5" height="8"  rx="1.2" />
        <rect x="9.5" y="8"  width="5" height="14" rx="1.2" />
        <rect x="17"  y="2"  width="5" height="20" rx="1.2" />
      </svg>

      <span className="text-xl font-bold text-white">
        Cripto<span className="text-emerald-400">Dash</span>
      </span>
    </Link>
  );
}