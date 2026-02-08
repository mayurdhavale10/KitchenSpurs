"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

type Props = {
    data: {
        date: string;
        orders: number;
        revenue: string;
    }[];
};

export default function TrendsChart({ data }: Props) {
    return (
        <div
            style={{
                marginTop: 30,
                padding: 20,
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                background: "#fff",
            }}
        >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                Daily Orders & Revenue
            </h3>

            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    {/* Left Y Axis — Orders */}
                    <YAxis yAxisId="left" />

                    {/* Right Y Axis — Revenue */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(v) => `₹${v}`}
                    />

                    <Tooltip
                        formatter={(value, name) =>
                            name === "revenue"
                                ? [`₹${value}`, "Revenue"]
                                : [value, "Orders"]
                        }
                    />

                    <Legend />

                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="orders"
                        stroke="#0f172a"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Orders"
                    />

                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Revenue"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
