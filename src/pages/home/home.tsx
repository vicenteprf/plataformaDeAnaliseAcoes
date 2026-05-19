import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import {
  fetchStocks,
  fetchMarketData,
  fetchFavorites,
  addFovorite,
  removeFavorite,
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
          setFavorites(favs),
        ]);
        setStock(stockData);
        setMarketData(market);
      } catch (error) {
        setError("Erro ao carregar as ações.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStocks();
  }, []);

  async function handleFavorite(ticker: string) {
    if (!user) return;

    if (favorites.includes(ticker)) {
      await removeFavorite(user.id, ticker);
      setFavorites((prev) => prev.filter((f) => f !== ticker));
    } else {
      await addFovorite(user.id, ticker);
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

            <Link className="text-sm font-medium text-white" to={"/"}>
              Mercado
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
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              IBOVESPA
            </p>

            <h2 className="mt-2 text-3xl font-bold text-lime-400">
              {marketData?.ibovespa.toLocaleString("pt-BR") ?? "..."}
            </h2>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Variação hoje
            </p>

            <h2 className="mt-2 text-3xl font-bold text-lime-400">
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

            <h2 className="mt-2 text-3xl font-bold text-red-400">
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

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <section className="rounded-2xl border border-zinc-800 bg-[#0B1020]">
            <div className="border-b border-zinc-800 p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <input
                  type="text"
                  placeholder="Buscar ação, ticker ou empresa..."
                  className="h-12 flex-1 rounded-xl border border-zinc-700 bg-[#111827] px-4 text-white outline-none focus:border-blue-500"
                />

                <button className="rounded-xl border border-zinc-700 bg-[#111827] px-5 text-sm text-zinc-300 cursor-pointer">
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
                    <th>Dy Ano</th>
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
                  {stock.map((s) => (
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
                          {s.regularMarketChangePercent >= 0 ? "+" : ""}{" "}
                          {s.regularMarketChangePercent.toFixed(2)}
                        </span>
                      </td>

                      <td
                        className={
                          s.dividendYield && s.dividendYield > 0
                            ? "text-lime-400"
                            : "text-zinc-500"
                        }
                      >
                        {s.dividendYield
                          ? `${s.dividendYield.toFixed(2)}%`
                          : "-"}{" "}
                      </td>

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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">
            {/* ALTAS */}
            <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase text-zinc-400">
                Maiores altas
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[#111827] p-3">
                  <span className="font-semibold">WEGE3</span>

                  <span className="rounded-full bg-lime-500/10 px-3 py-1 text-sm text-lime-400">
                    +3,41%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#111827] p-3">
                  <span className="font-semibold">PETR4</span>

                  <span className="rounded-full bg-lime-500/10 px-3 py-1 text-sm text-lime-400">
                    +2,14%
                  </span>
                </div>
              </div>
            </div>

            {/* QUEDAS */}

            <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase text-zinc-400">
                Maiores quedas
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[#111827] p-3">
                  <span className="font-semibold">MGLU3</span>

                  <span className="rounded-full bg-lime-500/10 px-3 py-1 text-sm text-red-400">
                    -4,36%
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
