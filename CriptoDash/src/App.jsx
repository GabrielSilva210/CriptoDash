import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Home from './pages/Home'
import CoinDetail from './pages/CoinDetail'
import { useCryptoSearch } from './hooks/useCryptoSearch'

export default function App() {
  const { coins, loading, error, searched, search } = useCryptoSearch()
  const [selectedCoinId, setSelectedCoinId] = useState(null)

  return (
    <div className="flex h-screen bg-[#0f1c2e]">
      <Sidebar
        coins={coins}
        selectedCoinId={selectedCoinId}
        onSelectCoin={setSelectedCoinId}
        onGoHome={() => setSelectedCoinId(null)}
        onSearch={search}
        searching={loading}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onSearch={search} disabled={loading} />

        <main className="flex-1 overflow-y-auto">

          <div hidden={selectedCoinId !== null}>
            <Home
              coins={coins}
              loading={loading}
              error={error}
              searched={searched}
              onSelectCoin={setSelectedCoinId}
            />
          </div>

          {selectedCoinId && (
            <CoinDetail
              key={selectedCoinId}
              coinId={selectedCoinId}
              onBack={() => setSelectedCoinId(null)}
            />
          )}

        </main>
      </div>
    </div>
  )
}