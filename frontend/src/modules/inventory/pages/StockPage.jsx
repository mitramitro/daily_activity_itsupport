import { useEffect, useState } from "react";
import api from "../../../services/api";
import StockCard from "../components/StockCard";
import StockTable from "../components/StockTable";

export default function StockPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/stocks").then((res) => {
      setData(res.data.data);
    });
  }, []);

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
