import { useState } from "react";
import { overallStats, companies } from "../data/ndaData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const PURPLE = "#42177B";
const ORANGE = "#f97316";
const PURPLE_LIGHT = "#c4b5fd";

const card = {
  background: "#fff",
  borderRadius: 12,
  padding: "16px 20px",
  border: "1px solid #ede9fe",
};

export default function Overview() {
  const [selectedCompany, setSelectedCompany] = useState("all");

  const isAll = selectedCompany === "all";
  const company = companies.find(c => c.org_name === selectedCompany);

  const stats = isAll ? {
    total: overallStats.total,
    signed: overallStats.signed,
    sent: overallStats.sent,
    outstanding: overallStats.total - overallStats.signed,
    pct_signed: overallStats.pctSigned,
  } : company;

  const pieData = [
    { name: "Signed", value: stats.signed },
    { name: "Sent – awaiting", value: stats.sent },
    { name: "Outstanding", value: Math.max(0, stats.outstanding - stats.sent) },
  ];

  const barData = isAll
    ? companies.slice(0, 8).map(c => ({
        name: c.org_name.split(" ").slice(0, 2).join(" "),
        signed: c.signed,
        outstanding: c.outstanding,
      }))
    : [
        { name: "Signed", value: stats.signed, fill: PURPLE },
        { name: "Awaiting Signature", value: stats.sent, fill: ORANGE },
        { name: "Not Yet Sent", value: Math.max(0, stats.outstanding - stats.sent), fill: PURPLE_LIGHT },
      ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#3b0764" }}>NDA Tracker</h1>
        <select
          value={selectedCompany}
          onChange={e => setSelectedCompany(e.target.value)}
          style={{ fontSize: 13, padding: "6px 12px", borderRadius: 8, border: "1px solid #ede9fe", color: "#3b0764", background: "#fff", cursor: "pointer", maxWidth: 280 }}
        >
          <option value="all">All Companies</option>
          {companies.map(c => (
            <option key={c.org_name} value={c.org_name}>{c.org_name}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards — same layout always */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
  <div style={card}>
    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Total NDAs Out</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: PURPLE }}>{stats.total.toLocaleString()}</div>
  </div>
  <div style={card}>
    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>% Signed</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: PURPLE }}>{stats.pct_signed}%</div>
    <div style={{ fontSize: 11, color: ORANGE }}>{stats.signed.toLocaleString()} signed</div>
  </div>
  <div style={card}>
    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Total Number Signed</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: PURPLE }}>{stats.signed.toLocaleString()}</div>
  </div>
  <div style={card}>
    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Awaiting Signature</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: ORANGE }}>{stats.sent.toLocaleString()}</div>
  </div>
  <div style={card}>
    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Not Yet Sent</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: ORANGE }}>{(stats.outstanding - stats.sent).toLocaleString()}</div>
  </div>
</div>

      {/* Charts — same layout always */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>

        {/* Pie chart — always shown */}
        <div style={card}>
          <div style={{ fontWeight: 500, marginBottom: 12, color: "#3b0764" }}>Status breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                label={({ percent }) => percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : ""}
                labelLine={false} fontSize={11}>
                <Cell fill={PURPLE} />
                <Cell fill={ORANGE} />
                <Cell fill={PURPLE_LIGHT} />
              </Pie>
              <Tooltip formatter={v => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#6b7280", justifyContent: "center", marginTop: 8 }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: PURPLE, borderRadius: 2, marginRight: 4 }}></span>Signed</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: ORANGE, borderRadius: 2, marginRight: 4 }}></span>Awaiting signature</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: PURPLE_LIGHT, borderRadius: 2, marginRight: 4 }}></span>Not Yet Sent</span>
          </div>
        </div>

        {/* Bar chart — top companies when all, breakdown by status when single company */}
        <div style={card}>
          <div style={{ fontWeight: 500, marginBottom: 12, color: "#3b0764" }}>
            {isAll ? "Top companies — signed vs total NDA's Out" : `${selectedCompany} — breakdown`}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            {isAll ? (
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                <Tooltip formatter={v => v.toLocaleString()} />
                <Bar dataKey="signed" fill={PURPLE} name="Signed" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="outstanding" fill={PURPLE_LIGHT} name="Total Out" stackId="a" radius={[0, 3, 3, 0]} />
              </BarChart>
            ) : (
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v.toLocaleString()} />
                <Tooltip formatter={v => v.toLocaleString()} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}