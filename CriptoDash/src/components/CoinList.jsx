function CoinList({ coins, onSelect }) {
  return (
    <ul className="flex flex-col gap-2">
      {coins.map((coin) => (
        <li key={coin.id}>
          <button
            type="button"
            onClick={() => onSelect(coin.id)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-emerald-500"
          >
          <img src={coin.thumb} alt="" className="h-8 w-8 rounded-full" />

          <div className="flex-1">
            <p className="font-semibold text-slate-900">{coin.name}</p>
            <p className="text-sm uppercase text-slate-500">{coin.symbol}</p>
          </div>

          {coin.market_cap_rank && (
            <span className="text-sm text-slate-500">
              #{coin.market_cap_rank}
            </span>
          )}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default CoinList