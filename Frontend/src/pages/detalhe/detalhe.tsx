import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fetchStockDetail } from "../../service/stockService";
import type { Stock } from "../../types/stock";
import { MOCK_COMPANY_ABOUT, type Ticker } from "../../mocks/sobreEmpresa.mock";
import { supabase } from "../../lib/supabase";

export default function Detalhes() {
  const [stock, setStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<string>("1mo");
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDetail() {
      try {
        const data = await fetchStockDetail(ticker!, range);
        setStock(data);
      } catch {
        setError("Erro ao carregar os dados da ação");
      } finally {
        setIsLoading(false);
      }
    }

    loadDetail();
  }, [ticker, range]);

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `R$ ${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(2)}M`;

    return `R$ ${value}`;
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="border-b border-zinc-900 bg-[#070B17]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* LADO ESQUERDO */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition cursor-pointer"
            >
              ← Voltar
            </button>
          </div>

          <Link to="/home" className="text-2xl font-bold">
            Stock <span className="text-blue-500">Vault</span>
          </Link>

          {/* LADO DIREITO */}

          <div className="flex items-center gap-4">
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
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {isLoading && (
          <p className="text-zinc-500 animate-pulse">
            Carregando dados da ação...
          </p>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {stock && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">
                  {stock.name ?? stock.longName}
                </h2>
                <span className="rounded-full bg-blue-400 px-2 py-1  font-medium text-blue-900 text-xs">
                  {stock.shortName}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600/90 pb-2">
                {stock.industryDisp} - {stock.sector}
              </p>
              <div className="flex items-center gap-4">
                <span className=" text-5xl font-bold">
                  R$ {stock.regularMarketPrice.toFixed(2) ?? "-"}
                </span>
                <span
                  className={`rounded-full px-2  text-xs font-semibold ${stock.regularMarketChangePercent >= 0 ? `  bg-lime-400 text-lime-800` : ` bg-red-400 text-red-800`}`}
                >
                  {stock.regularMarketChangePercent >= 0 ? "+" : ""}
                  {stock.regularMarketChangePercent.toFixed(2)}%
                </span>
                <span className="mt-2 text-sm text-zinc-600/90 pb-2">
                  {stock.regularMarketChange >= 0 ? "+" : ""}
                  R$ {stock.regularMarketChange.toFixed(2)}% hoje
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                {
                  label: "Preço Mín. Hoje",
                  value: `R$ ${stock.regularMarketDayLow?.toFixed(2) ?? "-"}`,
                },
                {
                  label: "Preço Máx. Hoje",
                  value: `R$ ${stock.regularMarketDayHigh?.toFixed(2) ?? "-"}`,
                },
                {
                  label: "Volume",
                  value:
                    stock.regularMarketVolume?.toLocaleString("pt-BR") ?? "-",
                },
                {
                  label: "Dividend Yield",
                  value: stock.dividendYield
                    ? `${stock.dividendYield.toFixed(2)}%`
                    : "-",
                },
                {
                  label: "Mín. 52 sem.",
                  value: `R$ ${stock.fiftyTwoWeekLow?.toFixed(2) ?? "-"}`,
                },
                {
                  label: "Máx. 52 sem.",
                  value: `R$ ${stock.fiftyTwoWeekHigh?.toFixed(2) ?? "-"}`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            {stock.historicalDataPrice && (
              <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-6 mb-6">
                <div className="flex gap-2 mb-4">
                  {[
                    { label: "1D", value: "1d" },
                    { label: "5D", value: "5d" },
                    { label: "1M", value: "1mo" },
                    { label: "3M", value: "3mo" },
                    // { label: "1A", value: "1y" },
                    // { label: "MAX", value: "max" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setRange(item.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${range === item.value ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    data={stock.historicalDataPrice.map((d) => ({
                      date: new Date(d.date * 1000).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      }),
                      preco: d.close,
                    }))}
                  >
                    <defs>
                      <linearGradient
                        id="colorPreco"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#52525b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fill: "#52525b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={55}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#0B1020",
                        border: "1px solid #27272a",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "#a1a1aa" }}
                      formatter={(value) => [
                        `R$ ${Number(value).toFixed(2)}`,
                        "Preço",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="preco"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorPreco)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-4">
                Sobre a empresa
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {MOCK_COMPANY_ABOUT[ticker?.toUpperCase() as Ticker]}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 ">
              {[
                {
                  label: "p/l",
                  value: `${stock.priceEarnings?.toFixed(2) ?? "-"}`,
                },
                {
                  label: "p/vp",
                  value: `${stock.priceToBook?.toFixed(2) ?? "-"}`,
                },
                {
                  label: "roe",
                  value: "-",
                },
                {
                  label: "Ev/ebitda",
                  value: "-",
                },
                {
                  label: "Divida/ebitda",
                  value: `-`,
                },
                {
                  label: "Valor de mercado",
                  value: formatMarketCap(stock.marketCap),
                },
                {
                  label: "Lucro por ação",
                  value: `${stock.earningsPerShare ? stock.earningsPerShare.toFixed(2) : "-"}`,
                },
                {
                  label: "Funcionários",
                  value: `${stock.fullTimeEmployees ? stock.fullTimeEmployees.toLocaleString("pt-BR") : "-"}`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-800 bg-[#0B1020] p-4 mb-2"
                >
                  <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <span className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              * Dados fundamentalistas completos disponíveis em breve
            </span>
          </>
        )}
      </div>
    </main>
  );
}
