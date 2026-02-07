"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function TrendsChart({ data }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Revenue */}
            <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Daily Revenue</h3>

                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Orders */}
            <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Daily Orders</h3>

                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
