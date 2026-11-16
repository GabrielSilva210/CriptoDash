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
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 transition-colors focus-within:border-emerald-500 focus-within:bg-white">
        <span className="text-slate-500">
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
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
        />
      </div>
    </form>
  )
}

export default SearchBar