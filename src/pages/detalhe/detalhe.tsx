import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import { fetchStockDetail } from "../../service/stockService";
import type { Stock } from "../../types/stock";

export default function Detalhes() {
  const [stock, setStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDetail() {
      try {
        const data = await fetchStockDetail(ticker!);
        setStock(data);
      } catch {
        setError("Erro ao carregar os dados da ação");
      } finally {
        setIsLoading(false);
      }
    }

    loadDetail();
  }, [ticker]);

  return (
    <>
      <div>
        <h1 className="text-lg font-bold text-red-500">Página de detalhes</h1>
      </div>
    </>
  );
}
