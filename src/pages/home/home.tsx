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
import type { Stock } from "../../types/stock";
import type { MarketData } from "../../service/stockService";

import { AuthContext } from "../../Context/AuthContext";

import { FiLogOut } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function Home() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [filter, setFilter] = useState("");
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
        (setFavorites(favs), setStock(stockData));
        setMarketData(market);
      } catch (error) {
        setError("Erro ao carregar as ações.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStocks();
  }, []);

  function handleFilter(e: ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);
  }

  async function handleSearch() {
    try {
      if (!filter.trim()) return;

      const data = await searchStock(filter.trim().toUpperCase());

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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              Stock <span className="text-blue-500">Vault</span>
            </h1>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link className="text-sm font-medium text-white" to={"/home"}>
              Home
            </Link>

            <a className="text-sm font-medium text-white cursor-pointer">
              Mercado
            </a>

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
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              IBOVESPA
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {marketData?.ibovespa.toLocaleString("pt-BR") ?? "..."}
            </h2>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Variação hoje
            </p>

            <h2
              className={`mt-2 text-3xl font-bold ${marketData?.ibovespaChange !== undefined && marketData.ibovespaChange >= 0 ? "text-lime-400" : "text-red-400"}`}
            >
              {marketData
                ? `${marketData.ibovespaChange >= 0 ? "+" : ""}${marketData.ibovespaChange.toFixed(2)}%`
                : "..."}
            </h2>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Vol. negociado
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {marketData
                ? `R$ ${(marketData.volume / 1e9).toFixed(1)}B`
                : "..."}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Dólar (USD)
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              R$ {marketData?.dolar.toFixed(2) ?? "..."}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Selic
            </p>

            <h2 className="mt-2 text-3xl font-bold ">13,75%</h2>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 ">
          <section className="rounded-2xl border border-zinc-800 bg-[#0B1020]">
            <div className="border-b border-zinc-800 p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <input
                  type="text"
                  name="text"
                  placeholder="Buscar ação, ticker ou empresa..."
                  className="h-12 flex-1 rounded-xl border border-zinc-700 bg-[#111827] px-4 text-white outline-none focus:border-blue-500"
                  onChange={handleFilter}
                  value={filter}
                />

                <button
                  onClick={handleSearch}
                  className="rounded-xl border border-zinc-700 bg-[#111827] px-5 text-sm text-zinc-300 cursor-pointer font-bold hover:bg-blue-600"
                >
                  Filtrar
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-full bg-blue-600 px-4 py-2 text-xs font-medium cursor-pointer">
                  Todas
                </button>

                <button className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-400 cursor-pointer">
                  Alta hoje
                </button>

                <button className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-400 cursor-pointer">
                  Maior DY
                </button>

                <button className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-400 cursor-pointer">
                  Financeiro
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800 text-left text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="p-4">Empresa</th>
                    <th>Preço</th>
                    <th>Variação</th>
                    <th>Favorito</th>
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
                      <td colSpan={4} className="p-4 text-center-text-red-400">
                        {error}
                      </td>
                    </tr>
                  )}
                  {stock.slice(0, visibleCount).map((s) => (
                    <tr
                      onClick={() => navigate(`/detalhes/${s.symbol}`)}
                      key={s.symbol}
                      className=" border-b border-zinc-900 hover:bg-[#111827] cursor-pointer"
                    >
                      <td className="p-4">
                        <div>
                          <h3 className="font-semibold">{s.symbol}</h3>
                          <p className="text-sm text-zinc-500">{s.shortName}</p>
                        </div>
                      </td>

                      <td className="font-semibold">
                        R$ {s.regularMarketPrice.toFixed(2)}
                      </td>

                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${s.regularMarketChangePercent >= 0 ? "bg-lime-500/10 text-lime-400" : "bg-red-500/10 text-red-400"}`}
                        >
                          {s.regularMarketChangePercent >= 0 ? "+" : " "}{" "}
                          {s.regularMarketChangePercent.toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(s.symbol);
                          }}
                          className={`ml-4 cursor-pointer transition mt-6 ${
                            favorites.includes(s.symbol)
                              ? "text-yellow-500"
                              : "text-zinc-600 hover:text-zinc-400"
                          }`}
                        >
                          {favorites.includes(s.symbol) ? (
                            <FaStar size={22} />
                          ) : (
                            <FaRegStar size={22} />
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
