
import CoinList from '../components/CoinList'
import Hero from '../components/Hero'
import MarketOverview from '../components/MarketOverview'

function Home({ coins, loading, error, searched, onSelectCoin }) {
  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
        <Hero />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <section>
          {loading && (
            <p className="text-slate-500">Buscando...</p>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && !error && searched && coins.length === 0 && (
            <p className="text-slate-500">
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

        <div className="mt-10">
          <MarketOverview />
        </div>
      </div>
    </div>
  )
}

export default Home
