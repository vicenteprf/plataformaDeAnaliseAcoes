import { useEffect, useState, useContext, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import {
  fetchStocks,
  fetchMarketData,
  fetchFavorites,
  addFavorite,
  removeFavorite,
  searchStock,
} from "../../service/stockService";
import type { Stock, MarketData } from "../../types/stock";

import { AuthContext } from "../../Context/AuthContext";

import { FiLogOut } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function Home() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [pesquisa, setPesquisa] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [visibleCount, setVisibleCount] = useState(5);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    async function loadStocks() {
      try {
        const favs = await fetchFavorites(user!.id);
        const [stockData, market] = await Promise.all([
          fetchStocks(),
          fetchMarketData(),
        ]);
        setFavorites(favs);
        setStock(stockData);
        setMarketData(market);
      } catch {
        setError("Erro ao carregar as ações.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStocks();
  }, [user]);

  const filterAcoes = stock.filter((acoes) => {
    if (filter === "Todas") return true;
    if (filter === "Alta hoje") return acoes.regularMarketChangePercent > 0;
    if (filter === "Baixa hoje") return acoes.regularMarketChangePercent < 0;
  });

  async function handlePesquisa(e: ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value;
    setPesquisa(valor);

    if (valor.trim().length === 0) {
      setError(null);
      setIsLoading(true);
      try {
        const stockData = await fetchStocks();
        setStock(stockData);
      } catch {
        setError("Erro ao restaurar a lista de ações.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function handleSearch() {
    try {
      if (!pesquisa.trim()) return;
      const data = await searchStock(pesquisa.trim().toUpperCase());
      if (!data) {
        setError("Ação não encontrada.");
        return;
      }
      setError(null);
      setStock([data]);
    } catch (e) {
      setError("Erro ao buscar ação.");
      console.log(e);
    }
  }

  async function handleFavorite(ticker: string) {
    if (!user) return;
    if (favorites.includes(ticker)) {
      await removeFavorite(user.id, ticker);
      setFavorites((prev) => prev.filter((f) => f !== ticker));
    } else {
      await addFavorite(user.id, ticker);
      setFavorites((prev) => [...prev, ticker]);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="border-b border-zinc-900 bg-[#070B17]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1 className="text-2xl font-bold">
            Stock <span className="text-blue-500">Vault</span>
          </h1>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link className="text-sm font-medium text-white" to={"/home"}>
              Home
            </Link>
            <Link
              className="text-sm font-medium text-white"
              to={"/minhasacoes"}
            >
              Favoritos
            </Link>
          </nav>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A] border border-zinc-800 text-zinc-400 hover:bg-red-900/30 hover:text-red-400 transition cursor-pointer"
          >
            <FiLogOut size={18} />
          </button>
        </div>

        {/* Nav mobile — aparece só abaixo de md */}
        <nav className="flex items-center gap-6 border-t border-zinc-900 px-4 py-2 md:hidden">
          <Link className="text-sm font-medium text-white" to={"/home"}>
            Home
          </Link>
          <Link
            className="text-sm font-medium text-zinc-400"
            to={"/minhasacoes"}
          >
            Favoritos
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Cards de mercado — 2 colunas no mobile, 5 no desktop */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              IBOVESPA
            </p>
            <h2 className="mt-2 text-xl font-bold text-white sm:text-3xl">
              {marketData?.ibovespa?.toLocaleString("pt-BR") ?? "..."}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Variação hoje
            </p>
            <h2
              className={`mt-2 text-xl font-bold sm:text-3xl ${
                marketData?.ibovespaChange !== undefined &&
                marketData.ibovespaChange >= 0
                  ? "text-lime-400"
                  : "text-red-400"
              }`}
            >
              {marketData
                ? `${marketData.ibovespaChange >= 0 ? "+" : ""}${marketData?.ibovespaChange?.toLocaleString("pt-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                : "..."}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Vol. negociado
            </p>
            <h2 className="mt-2 text-xl font-bold sm:text-3xl">
              {marketData
                ? `R$ ${(marketData.volume / 1e9).toLocaleString("pt-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B`
                : "..."}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Dólar (USD)
            </p>
            <h2 className="mt-2 text-xl font-bold text-white sm:text-3xl">
              R${" "}
              {marketData?.dolar?.toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? "..."}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Selic
            </p>
            <h2 className="mt-2 text-xl font-bold sm:text-3xl">14,25%</h2>
          </div>
        </section>

        <div className="mt-6">
          <section className="rounded-2xl border border-zinc-800 bg-[#0B1020]">
            {/* Barra de pesquisa e filtros */}
            <div className="border-b border-zinc-800 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="text"
                  placeholder="Buscar ticker..."
                  className="h-12 flex-1 rounded-xl border border-zinc-700 bg-[#111827] px-4 text-white outline-none focus:border-blue-500"
                  onChange={handlePesquisa}
                  value={pesquisa}
                />
                <button
                  onClick={handleSearch}
                  className="h-12 rounded-xl border border-zinc-700 bg-[#111827] px-4 text-sm text-zinc-300 cursor-pointer font-bold hover:bg-blue-600 whitespace-nowrap"
                >
                  Buscar
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {["Todas", "Alta hoje", "Baixa hoje"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-200 cursor-pointer
                      ${
                        filter === f
                          ? "bg-blue-600 text-white font-bold border-none"
                          : "text-zinc-400 border-zinc-700 hover:bg-blue-600 hover:text-white"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-90">
                <thead className="border-b border-zinc-800 text-left text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="p-4">Empresa</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4">Variação</th>
                    <th className="p-4">⭐</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-zinc-500">
                        Carregando...
                      </td>
                    </tr>
                  )}
                  {error && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-red-400">
                        {error}
                      </td>
                    </tr>
                  )}
                  {filterAcoes.slice(0, visibleCount).map((s) => (
                    <tr
                      onClick={() => navigate(`/detalhes/${s.symbol}`)}
                      key={s.symbol}
                      className="border-b border-zinc-900 hover:bg-[#111827] cursor-pointer"
                    >
                      <td className="p-4">
                        <h3 className="font-semibold text-sm">{s.symbol}</h3>
                        <p className="text-xs text-zinc-500 truncate max-w-25 sm:max-w-none">
                          {s.shortName}
                        </p>
                      </td>

                      <td className="p-4 font-semibold text-sm whitespace-nowrap">
                        R${" "}
                        {s.regularMarketPrice.toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                            s.regularMarketChangePercent > 0
                              ? "bg-lime-500/10 text-lime-400"
                              : s.regularMarketChangePercent < 0
                                ? "bg-red-500/10 text-red-400"
                                : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {s.regularMarketChangePercent > 0
                            ? `+${s.regularMarketChangePercent.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                            : `${s.regularMarketChangePercent.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(s.symbol);
                          }}
                          className={`cursor-pointer transition ${
                            favorites.includes(s.symbol)
                              ? "text-yellow-500"
                              : "text-zinc-600 hover:text-zinc-400"
                          }`}
                        >
                          {favorites.includes(s.symbol) ? (
                            <FaStar size={20} />
                          ) : (
                            <FaRegStar size={20} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center p-4">
                {visibleCount < stock.length && (
                  <button
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + 5, stock.length),
                      )
                    }
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Carregar mais
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
