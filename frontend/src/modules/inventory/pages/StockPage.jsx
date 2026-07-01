import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import StockCard from "../components/StockCard";
import StockTable from "../components/StockTable";

export default function StockPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const effectiveId = user?.effective_office_id || user?.office?.parent_office_id || user?.office_id;
    const params = effectiveId ? { office_id: effectiveId } : {};
    api.get("/stocks", { params }).then((res) => {
      setData(res.data.data);
    });
  }, [user]);

  return (
    <>
      <div className="divide-y divide-gray-100 md:hidden">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 text-sm px-4 py-8">Belum ada stok</p>
        ) : (
          data.map((row) => <StockCard key={row.id} data={row} />)
        )}
      </div>

      <div className="hidden md:block p-4 md:p-6">
        <StockTable data={data} />
      </div>
    </>
  );
}
