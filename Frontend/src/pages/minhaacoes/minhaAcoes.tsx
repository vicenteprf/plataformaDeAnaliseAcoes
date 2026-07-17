import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import {
  fetchMarketData,
  fetchFavorites,
  fetchStockDetail,
  addFavorite,
  removeFavorite,
} from "../../service/stockService";
import type { Stock, MarketData } from "../../types/stock";

import { AuthContext } from "../../Context/AuthContext";

import { FiLogOut } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function MinhasAcoes() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStocks() {
      try {
        const favs = await fetchFavorites(user!.id);
        setFavorites(favs);

        const market = await fetchMarketData();
        setMarketData(market);

        const stockData = await Promise.all(
          favs.map((ticker) => fetchStockDetail(ticker)),
        );
        setStock(stockData);
      } catch {
        setError("Erro ao carregar as ações.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStocks();
  }, [user]);

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

  const favoriteStocks = stock.filter((item) =>
    favorites.includes(item.symbol),
  );

  const stocksUpToday = favoriteStocks.filter(
    (s) => s.regularMarketChangePercent > 0,
  ).length;

  const stocksDownToday = favoriteStocks.filter(
    (s) => s.regularMarketChangePercent < 0,
  ).length;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="border-b border-zinc-900 bg-[#070B17]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/home" className="text-2xl font-bold">
            Stock <span className="text-blue-500">Vault</span>
          </Link>

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
          <Link className="text-sm font-medium text-zinc-400" to={"/home"}>
            Home
          </Link>
          <Link className="text-sm font-medium text-white" to={"/minhasacoes"}>
            Favoritos
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Cards — 2 colunas no mobile, 5 no desktop */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Ações salvas
            </p>
            <h2 className="mt-2 text-xl font-bold sm:text-3xl">
              {favorites.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Em alta hoje
            </p>
            <h2 className="mt-2 text-xl font-bold text-lime-400 sm:text-3xl">
              {stocksUpToday}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Em baixa hoje
            </p>
            <h2 className="mt-2 text-xl font-bold text-red-400 sm:text-3xl">
              {stocksDownToday}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Dólar (USD)
            </p>
            <h2 className="mt-2 text-xl font-bold text-white sm:text-3xl">
              R${" "}
              {marketData?.dolar.toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? "..."}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Selic
            </p>
            <h2 className="mt-2 text-xl font-bold sm:text-3xl">14,50%</h2>
          </div>
        </section>

        <div className="mt-6">
          <section className="rounded-2xl border border-zinc-800 bg-[#0B1020]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px]">
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
                  {favoriteStocks.map((s) => (
                    <tr
                      onClick={() => navigate(`/detalhes/${s.symbol}`)}
                      key={s.symbol}
                      className="border-b border-zinc-900 hover:bg-[#111827] cursor-pointer"
                    >
                      <td className="p-4">
                        <h3 className="font-semibold text-sm">{s.symbol}</h3>
                        <p className="text-xs text-zinc-500 truncate max-w-[100px] sm:max-w-none">
                          {s.longName ?? s.name}
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
                          className={`rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap ${
                            s.regularMarketChangePercent > 0
                              ? "bg-lime-400/80 text-lime-950"
                              : s.regularMarketChangePercent < 0
                                ? "bg-red-400/80 text-red-950"
                                : "bg-gray-400/80 text-gray-900"
                          }`}
                        >
                          {s.regularMarketChangePercent > 0 ? "+" : ""}
                          {s.regularMarketChangePercent.toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                          %
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
                              : "text-zinc-500"
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
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
