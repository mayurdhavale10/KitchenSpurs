"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function TopRestaurants({ data }: any) {
    return (
        <div className="border rounded p-4 mt-6">
            <h2 className="text-xl font-semibold mb-2">Top Restaurants by Revenue</h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
