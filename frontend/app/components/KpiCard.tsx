type Props = {
    title: string;
    value: string | number;
};

export default function KpiCard({ title, value }: Props) {
    return (
        <div
            style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 20,
                background: "#fff",
            }}
        >
            <p style={{ fontSize: 14, color: "#64748b" }}>{title}</p>
            <h2 style={{ fontSize: 28, fontWeight: 600 }}>{value}</h2>
        </div>
    );
}
