import { useState } from 'react'

function App() {
  const [cliques, setCliques] = useState(0)
  const [cartoes, setCartoes] = useState([1, 2])

  function handleClick() {
    setCliques(cliques + 1)
    alert("teste")
  }

  function criarCartao() {
    setCartoes([...cartoes, cartoes.length + 1])
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 py-10">
      {cartoes.map((id) => (
        <div
          key={id}
          className={`min-h-40 w-full max-w-xs flex flex-col items-center justify-center p-5 rounded-2xl ${
            id % 2 === 0 ? 'bg-black' : 'bg-blue-900'
          }`}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-emerald-600">Texto 1</h1>
            <h1 className="text-4xl font-bold text-blue-600">Texto 2</h1>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-yellow-500">Texto 3</h1>
            <h1 className="text-4xl font-bold text-pink-600">Texto 4</h1>
          </div>
        </div>
      ))}

      <button
        onClick={handleClick}
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-xl cursor-pointer"
      >
        Cliques: {cliques}
      </button>

      <button
        onClick={criarCartao}
        className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl cursor-pointer"
      >
        Criar novo cartão
      </button>
    </div>
  )
}

export default App