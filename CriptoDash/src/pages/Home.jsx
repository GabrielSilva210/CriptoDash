import CoinList from '../components/CoinList'
import Hero from '../components/Hero'
import MarketOverview from '../components/MarketOverview'

function Home({ coins, loading, error, searched, onSelectCoin }) {
  return (
    <div className="min-h-full bg-[#0f1c2e] text-white">
      <Hero />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <section>
          {loading && (
            <p className="text-slate-400">Buscando...</p>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && !error && searched && coins.length === 0 && (
            <p className="text-slate-400">
              Nenhuma criptomoeda encontrada.
            </p>
          )}

          {!loading && coins.length > 0 && (
            <CoinList
              coins={coins}
              onSelect={onSelectCoin}
            />
          )}
        </section>

      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10">
        <MarketOverview onSelectCoin={onSelectCoin} />
      </div>
    </div>
  )
}

export default Home