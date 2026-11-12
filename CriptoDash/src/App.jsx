import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Criptomoedas from "./pages/Criptomoedas";
import Favoritos from "./pages/Favoritos";
import Comparar from "./pages/Comparar";
import Sobre from "./pages/Sobre";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/criptomoedas" element={<Criptomoedas />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/comparar" element={<Comparar />} />
        <Route path="/sobre" element={<Sobre />} />
      </Route>
    </Routes>
  );
}