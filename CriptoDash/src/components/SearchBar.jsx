import { useState } from 'react'
import { SearchIcon } from './icons'

function SearchBar({ onSearch, disabled }) {
  const [valor, setValor] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const termo = valor.trim()
    if (!termo) return

    onSearch(termo)
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <div className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 transition-colors focus-within:border-emerald-500">
        <span className="text-slate-400">
          <SearchIcon />
        </span>

        <input
          type="search"
          placeholder="Buscar por criptomoeda (ex: Bitcoin, Ethereum...)"
          aria-label="Buscar por criptomoeda"
          autoComplete="off"
          disabled={disabled}
          value={valor}
          onChange={(event) => setValor(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
        />
      </div>
    </form>
  )
}

export default SearchBar