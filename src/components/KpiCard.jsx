export default function KpiCard({ label, value, change, positive }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: "#111" }}>{value}</div>
      <div style={{ fontSize: 12, marginTop: 4, color: positive ? "#22c55e" : "#ef4444" }}>
        {positive ? "▲" : "▼"} {change}
      </div>
    </div>
  );
}