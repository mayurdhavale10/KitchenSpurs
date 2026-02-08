"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import TrendsChart from "@/app/components/TrendsChart";
import Image from "next/image";

type DailyTrend = {
    date: string;
    orders: number;
    revenue: string;
};

type Restaurant = {
    id: number;
    name: string;
    location: string;
    cuisine: string;
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
    const { id } = useParams();
    const router = useRouter();

    const [data, setData] = useState<AnalyticsResponse | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const from = "2025-06-22";
    const to = "2025-06-28";

    useEffect(() => {
        if (!id) return;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const [restaurantRes, analyticsRes] = await Promise.all([
                    api.get(`/restaurants/${id}`),
                    api.get(`/restaurants/${id}/trends`, { params: { from, to } }),
                ]);

                setRestaurant(restaurantRes.data);
                setData(analyticsRes.data);
            } catch (err) {
                setError("Failed to load analytics");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    const totalOrders = data?.daily.reduce((sum, d) => sum + d.orders, 0) ?? 0;
    const totalRevenue =
        data?.daily.reduce((sum, d) => sum + Number(d.revenue), 0) ?? 0;

    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Header with Logo */}
            <header className="bg-black text-white py-6 px-8 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/KitchenSpurs.webp"
                            alt="Kitchen Spurs Logo"
                            width={60}
                            height={60}
                            className="rounded-full"
                        />
                        <div>
                            <h1 className="text-3xl font-bold">Kitchen Spurs Analytics</h1>
                            {restaurant && (
                                <p className="text-white/80 mt-1">
                                    {restaurant.name} · {restaurant.location} · {restaurant.cuisine}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/")}
                    className="mb-6 flex items-center gap-2 text-black hover:text-gray-700 font-medium transition-colors"
                >
                    <span className="text-xl">←</span>
                    <span>Back to Dashboard</span>
                </button>

                {loading && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 text-lg">Loading analytics…</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {data && (
                    <>
                        {/* KPI CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
                                <div className="text-gray-600 text-sm font-medium">
                                    Total Orders
                                </div>
                                <div className="text-3xl font-bold text-black mt-2">
                                    {totalOrders}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
                                <div className="text-gray-600 text-sm font-medium">
                                    Total Revenue
                                </div>
                                <div className="text-3xl font-bold text-black mt-2">
                                    ₹{totalRevenue.toFixed(0)}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
                                <div className="text-gray-600 text-sm font-medium">
                                    Average Order Value
                                </div>
                                <div className="text-3xl font-bold text-black mt-2">
                                    ₹{data.average_order_value}
                                </div>
                            </div>
                        </div>

                        {/* LINE CHART */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4 text-black">
                                Orders & Revenue Trend
                            </h2>
                            <TrendsChart data={data.daily} />
                        </div>

                        {/* DAILY PEAK HOURS */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4 text-black">
                                Daily Peak Hours
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-black text-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Date</th>
                                            <th className="px-6 py-3 text-left">Peak Hour</th>
                                            <th className="px-6 py-3 text-left">Total Orders</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-black">
                                        {Object.values(data.daily_peak_hours).map((d) => (
                                            <tr key={d.date} className="border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{d.date}</td>
                                                <td className="px-6 py-4">{d.hour}:00</td>
                                                <td className="px-6 py-4">{d.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}