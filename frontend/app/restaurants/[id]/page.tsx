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
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [startHour, setStartHour] = useState("");
    const [endHour, setEndHour] = useState("");
    const [from, setFrom] = useState("2025-06-22");
    const [to, setTo] = useState("2025-06-28");

    useEffect(() => {
        if (!id) return;

        async function loadRestaurant() {
            try {
                const restaurantRes = await api.get(`/restaurants/${id}`);
                setRestaurant(restaurantRes.data);
            } catch (err) {
                console.error("Failed to load restaurant:", err);
            }
        }

        loadRestaurant();
    }, [id]);

    const loadAnalytics = () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        const analyticsParams = {
            from,
            to,
            min_amount: minAmount,
            max_amount: maxAmount,
            start_hour: startHour,
            end_hour: endHour,
        };

        api
            .get(`/restaurants/${id}/trends`, {
                params: analyticsParams,
            })
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError("Failed to load analytics");
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadAnalytics();
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

                {/* Filters Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-black">Filters</h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="text-black hover:text-gray-700 underline focus:outline-none"
                        >
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-300">
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">
                                    Min Order (₹)
                                </label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded px-4 py-2 text-black"
                                    placeholder="0"
                                    value={minAmount}
                                    onChange={(e) => setMinAmount(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">
                                    Max Order (₹)
                                </label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded px-4 py-2 text-black"
                                    placeholder="10000"
                                    value={maxAmount}
                                    onChange={(e) => setMaxAmount(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">Start Hour</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded px-4 py-2 text-black"
                                    placeholder="0-23"
                                    min="0"
                                    max="23"
                                    value={startHour}
                                    onChange={(e) => setStartHour(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">End Hour</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded px-4 py-2 text-black"
                                    placeholder="0-23"
                                    min="0"
                                    max="23"
                                    value={endHour}
                                    onChange={(e) => setEndHour(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">From Date</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded px-4 py-2 text-black"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">To Date</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded px-4 py-2 text-black"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>

                            <div className="flex items-end col-span-2 md:col-span-3 lg:col-span-6">
                                <button
                                    onClick={loadAnalytics}
                                    className="w-full bg-black text-white rounded px-6 py-2 hover:bg-gray-800 transition-colors h-[42px]"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

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