function CoinList({ coins }) {
  return (
    <ul className="flex flex-col gap-2">
      {coins.map((coin) => (
        <li
          key={coin.id}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
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
        </li>
      ))}
    </ul>
  )
}

export default CoinList