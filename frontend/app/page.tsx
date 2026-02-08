"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";

import KpiCard from "@/app/components/KpiCard";
import TrendsChart from "@/app/components/TrendsChart";

type Restaurant = {
  id: number;
  name: string;
};

type DailyTrend = {
  date: string;
  orders: number;
  revenue: string;
};

export default function HomePage() {
  const router = useRouter();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [daily, setDaily] = useState<DailyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  const FROM = "2025-06-22";
  const TO = "2025-06-28";

  // 🔹 Load global restaurants + analytics
  useEffect(() => {
    async function load() {
      setLoading(true);

      const [restaurantsRes, analyticsRes] = await Promise.all([
        api.get("/restaurants"),
        api.get(`/restaurants/101/trends?from=${FROM}&to=${TO}`), // any ID works for global totals
      ]);

      setRestaurants(restaurantsRes.data.data || restaurantsRes.data);
      setDaily(analyticsRes.data.daily);
      setLoading(false);
    }

    load();
  }, []);

  // 🔹 Global KPIs
  const totalOrders = daily.reduce((sum, d) => sum + d.orders, 0);
  const totalRevenue = daily.reduce(
    (sum, d) => sum + Number(d.revenue),
    0
  );

  if (loading) {
    return <p style={{ padding: 40 }}>Loading dashboard…</p>;
  }

  return (
    <main
      style={{
        padding: 40,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>
          Kitchen Spurs Analytics
        </h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>
          Global performance overview
        </p>
      </header>

      {/* KPI Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <KpiCard title="Total Orders" value={totalOrders} />
        <KpiCard title="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} />
      </section>

      {/* Global Trend Chart */}
      <section style={{ marginBottom: 50 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          Orders & Revenue Trend
        </h2>
        <TrendsChart data={daily} />
      </section>

      {/* Restaurants Navigation */}
      <section>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          Restaurants
        </h2>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {restaurants.map((r) => (
            <button
              key={r.id}
              onClick={() => router.push(`/restaurants/${r.id}`)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              {r.name}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
