import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import { useCryptoSearch } from "./hooks/useCryptoSearch";

export default function App() {
  const { coins, loading, error, searched, search } = useCryptoSearch();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onSearch={search} disabled={loading} />

        <main className="flex-1 overflow-y-auto">
          <Home
            coins={coins}
            loading={loading}
            error={error}
            searched={searched}
          />
        </main>
      </div>
    </div>
  );
}