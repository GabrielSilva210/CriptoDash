// Sidebar.jsx
import { useState } from "react";
import CoinSidebar from "./CoinSidebar";
import SearchBar from "./SearchBar";
import {
  HomeIcon,
  DatabaseIcon,
  StarIcon,
  ScaleIcon,
  InfoIcon,
  BarChartIcon,
  ArrowRightIcon,
} from "./icons";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: HomeIcon },
  { id: "criptomoedas", label: "Criptomoedas", icon: DatabaseIcon },
  { id: "favoritos", label: "Favoritos", icon: StarIcon },
  { id: "comparar", label: "Comparar", icon: ScaleIcon },
  { id: "sobre", label: "Sobre", icon: InfoIcon },
];

export default function Sidebar({
  coins,
  selectedCoinId,
  onSelectCoin,
  onGoHome,
  onSearch,
  searching,
}) {
  const [active, setActive] = useState("dashboard");

  // Modo "moeda": aparece sempre que uma moeda está aberta
  const coinMode = selectedCoinId !== null;

  return (
    <aside className="flex h-screen w-80 flex-shrink-0 flex-col bg-[#0b1623] px-4 py-6 text-slate-300">
      {/* Logo (clicável: volta pro início) */}
      <button
        type="button"
        onClick={onGoHome}
        className="mb-6 flex cursor-pointer items-center gap-2 px-2 text-left"
      >
        <BarChartIcon className="h-8 w-8 text-emerald-400" />
        <span className="text-xl font-bold text-white">
          Cripto<span className="text-emerald-400">Dash</span>
        </span>
      </button>

      {coinMode ? (
        <>
          <div className="mb-4">
            <SearchBar
              onSearch={onSearch}
              disabled={searching}
              placeholder="Buscar criptomoedas..."
            />
          </div>

          <CoinSidebar
            coins={coins}
            selectedId={selectedCoinId}
            onSelect={onSelectCoin}
          />
        </>
      ) : (
        <>
          {/* Menu */}
          <nav className="flex flex-col gap-1">
            {menuItems.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive
                      ? "bg-emerald-500/15 text-white border-l-4 border-emerald-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                    }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-emerald-400" : ""}`}
                  />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Card inferior */}
          <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <BarChartIcon className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
            <p className="mb-3 text-sm text-slate-300">
              Acompanhe o mercado em tempo real.
            </p>
            <button className="flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25">
              Sobre o CriptoDash <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}