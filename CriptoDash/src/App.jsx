import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";
import { IconeHome, IconeMoedas, IconeEstrela, IconeBalanca, IconeInfo } from "./Icones";

const itens = [
  { to: "/", label: "Dashboard", icone: IconeHome },
  { to: "/criptomoedas", label: "Criptomoedas", icone: IconeMoedas },
  { to: "/favoritos", label: "Favoritos", icone: IconeEstrela },
  { to: "/comparar", label: "Comparar", icone: IconeBalanca },
  { to: "/sobre", label: "Sobre", icone: IconeInfo },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-52 shrink-0 flex-col bg-slate-900 p-4 text-slate-300 lg:flex">
      <Logo />

      <nav className="flex flex-col gap-1">
        {itens.map(({ to, label, icone: Icone }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-emerald-900/50 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icone />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-slate-700 p-4 text-center text-sm">
        <p>Acompanhe o mercado em tempo real.</p>
        <Link
          to="/sobre"
          className="mt-3 inline-block rounded-lg bg-emerald-900/40 px-3 py-2 text-emerald-400"
        >
          Sobre o CriptoDash →
        </Link>
      </div>
    </aside>
  );
}