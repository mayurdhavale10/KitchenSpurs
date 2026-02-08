"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import TrendsChart from "@/app/components/TrendsChart";
import Image from "next/image";

type Restaurant = {
  id: number;
  name: string;
  location?: string;
  cuisine?: string;
};

type DailyTrend = {
  date: string;
  orders: number;
  revenue: string;
};

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [trends, setTrends] = useState<any>(null);
  const [top, setTop] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [location, setLocation] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");

  // pagination
  const [page, setPage] = useState(1);

  // dates
  const [from, setFrom] = useState("2025-06-22");
  const [to, setTo] = useState("2025-06-28");

  const loadRestaurants = () => {
    api
      .get("/restaurants", {
        params: {
          search,
          cuisine,
          location,
          page,
        },
      })
      .then((res) => {
        console.log("Restaurants response:", res.data);
        // Handle both formats
        const data = res.data.data || res.data;
        setRestaurants(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error:", err);
        setRestaurants([]);
      });
  };

  useEffect(() => {
    loadRestaurants();
  }, [search, cuisine, location, page]);

  const loadAnalytics = () => {
    if (!selected) return;

    // Common analytics params - ALL FILTERS ADDED
    const analyticsParams = {
      from,
      to,
      search,
      cuisine,
      location,
      min_amount: minAmount,
      max_amount: maxAmount,
      start_hour: startHour,
      end_hour: endHour,
    };

    api
      .get(`/restaurants/${selected.id}/trends`, {
        params: analyticsParams,
      })
      .then((res) => {
        console.log("Trends response:", res.data);
        setTrends(res.data);
      })
      .catch((err) => console.error("Trends error:", err));

    api
      .get(`/top-restaurants`, {
        params: analyticsParams,
      })
      .then((res) => {
        console.log("Top restaurants response:", res.data);
        setTop(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Top restaurants error:", err));
  };

  useEffect(() => {
    loadAnalytics();
  }, [selected]);

  const totalOrders =
    trends?.daily?.reduce((a: number, b: DailyTrend) => a + b.orders, 0) || 0;

  const totalRevenue =
    trends?.daily?.reduce(
      (a: number, b: DailyTrend) => a + Number(b.revenue),
      0
    ) || 0;

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* Header with Logo */}
      <header className="bg-black text-white py-6 px-8 shadow-lg">
        <div className="flex items-center gap-4">
          <Image
            src="/KitchenSpurs.webp"
            alt="Kitchen Spurs Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h1 className="text-3xl font-bold">Kitchen Spurs Analytics</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-all duration-300">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Search</label>
                <input
                  className="border border-gray-300 rounded px-4 py-2 text-black"
                  placeholder="Restaurant Name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Cuisine</label>
                <input
                  className="border border-gray-300 rounded px-4 py-2 text-black"
                  placeholder="Italian, Indian..."
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Location</label>
                <input
                  className="border border-gray-300 rounded px-4 py-2 text-black"
                  placeholder="New York, Mumbai..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded px-4 py-2 text-black"
                  placeholder="0"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Max Order (₹)</label>
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
                  placeholder="0-24"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">End Hour</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded px-4 py-2 text-black"
                  placeholder="0-24"
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

              <div className="flex items-end">
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

        {/* Restaurants */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Restaurants</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(restaurants) &&
              restaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`border-2 rounded px-4 py-2 transition-all ${selected?.id === r.id
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-black hover:border-black"
                    }`}
                >
                  {r.name}
                </button>
              ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border border-gray-300 rounded px-4 py-2 text-black hover:border-black"
            >
              Prev
            </button>
            <span className="text-black">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="border border-gray-300 rounded px-4 py-2 text-black hover:border-black"
            >
              Next
            </button>
          </div>
        </div>

        {/* KPIs */}
        {trends && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
                <div className="text-gray-600 text-sm font-medium">Total Orders</div>
                <div className="text-3xl font-bold text-black mt-2">{totalOrders}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
                <div className="text-gray-600 text-sm font-medium">Total Revenue</div>
                <div className="text-3xl font-bold text-black mt-2">
                  ₹{totalRevenue.toFixed(0)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
                <div className="text-gray-600 text-sm font-medium">
                  Average Order Value
                </div>
                <div className="text-3xl font-bold text-black mt-2">
                  ₹{trends.average_order_value}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <TrendsChart data={trends.daily} />
            </div>

            {/* Peak Hours */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-black">Daily Peak Hours</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Peak Hour</th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {trends.daily_peak_hours &&
                      Object.values(trends.daily_peak_hours).map((d: any, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{d.date}</td>
                          <td className="px-6 py-4">{d.hour}:00</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Top Restaurants */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Top Restaurants
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Restaurant</th>
                  <th className="px-6 py-3 text-left">Orders</th>
                  <th className="px-6 py-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {Array.isArray(top) &&
                  top.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{r.name}</td>
                      <td className="px-6 py-4">{r.orders}</td>
                      <td className="px-6 py-4">₹{Number(r.revenue).toFixed(0)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}