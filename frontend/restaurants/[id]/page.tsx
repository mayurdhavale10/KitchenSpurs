"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import KpiCard from "@/app/components/KpiCard";
import TrendsChart from "@/app/components/TrendsChart";

type DailyTrend = {
    date: string;
    orders: number;
    revenue: string;
};

type AnalyticsResponse = {
    daily: DailyTrend[];
    average_order_value: number;
    daily_peak_hours: Record<
        string,
        {
            date: string;
            hour: number;
            total: number;
        }
    >;
};

export default function RestaurantPage() {
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<AnalyticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Date range (can later be controlled by UI)
    const from = "2025-06-22";
    const to = "2025-06-28";

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        api
            .get(`/restaurants/${id}/trends`, {
                params: { from, to },
            })
            .then((res) => {
                setData(res.data);
            })
            .catch(() => {
                setError("Failed to load analytics");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const totalOrders =
        data?.daily.reduce((sum, d) => sum + d.orders, 0) ?? 0;

    const totalRevenue =
        data?.daily.reduce((sum, d) => sum + Number(d.revenue), 0) ?? 0;

    return (
        <main style={{ padding: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600 }}>
                Restaurant Analytics
            </h1>
            <p style={{ color: "#64748b" }}>Restaurant ID: {id}</p>

            {loading && <p style={{ marginTop: 20 }}>Loading analytics…</p>}

            {error && (
                <p style={{ marginTop: 20, color: "red" }}>{error}</p>
            )}

            {data && (
                <>
                    {/* KPI CARDS */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 20,
                            marginTop: 30,
                        }}
                    >
                        <KpiCard title="Total Orders" value={totalOrders} />
                        <KpiCard
                            title="Total Revenue"
                            value={`₹${totalRevenue.toFixed(0)}`}
                        />
                        <KpiCard
                            title="Avg Order Value"
                            value={`₹${data.average_order_value}`}
                        />
                    </div>

                    {/* LINE CHART */}
                    <div style={{ marginTop: 40 }}>
                        <TrendsChart data={data.daily} />
                    </div>

                    {/* DAILY PEAK HOURS */}
                    <div style={{ marginTop: 40 }}>
                        <h3 style={{ fontSize: 20, marginBottom: 10 }}>
                            Daily Peak Hours
                        </h3>

                        <table border={1} cellPadding={10}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Peak Hour</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(data.daily_peak_hours).map((d) => (
                                    <tr key={d.date}>
                                        <td>{d.date}</td>
                                        <td>{d.hour}:00</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </main>
    );
}
