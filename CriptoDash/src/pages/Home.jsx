import SearchBar from '../components/SearchBar'
import CoinList from '../components/CoinList'
import MarketOverview from '../components/MarketOverview'
import { useCryptoSearch } from '../hooks/useCryptoSearch'

function Home() {
  const { coins, loading, error, searched, search } = useCryptoSearch()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-5xl px-6 py-8">
        <SearchBar onSearch={search} disabled={loading} />

        <section className="mt-4">
          {loading && <p className="text-slate-500">Buscando...</p>}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && searched && coins.length === 0 && (
            <p className="text-slate-500">Nenhuma criptomoeda encontrada.</p>
          )}

          {!loading && coins.length > 0 && <CoinList coins={coins} />}
        </section>

        <div className="mt-10">
          <MarketOverview />
        </div>
      </main>
    </div>
  )
}

export default Home