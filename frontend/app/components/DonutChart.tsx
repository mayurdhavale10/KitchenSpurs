"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const COLORS = ["#0A2540", "#2563EB", "#06B6D4", "#64748B"];

type Props = {
    data: { name: string; orders: number }[];
};

export default function DonutChart({ data }: Props) {
    const total = data.reduce((a, b) => a + b.orders, 0);

    return (
        <div style={{ width: 350, height: 350 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={80}
                        outerRadius={120}
                        dataKey="orders"
                        paddingAngle={3}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {/* Center text */}
            <div
                style={{
                    position: "relative",
                    top: "-215px",
                    textAlign: "center",
                    fontWeight: 600,
                }}
            >
                <p style={{ fontSize: 14, color: "#666" }}>Total Orders</p>
                <p style={{ fontSize: 28 }}>{total}</p>
            </div>
        </div>
    );
}
