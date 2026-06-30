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
      {/* MOBILE */}
      <div className="grid gap-3 md:hidden">
        {data.map((row) => (
          <StockCard key={row.id} data={row} />
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <StockTable data={data} />
      </div>
    </>
  );
}
