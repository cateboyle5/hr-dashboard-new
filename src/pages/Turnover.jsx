import { useState } from "react";
import { turnoverStats, companies, industryAverages, leaversByTenure, leaversByIndustry, trendData } from "../data/turnoverData";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine
} from "recharts";

const PURPLE = "#7c3aed";
const ORANGE = "#f97316";
const PURPLE_LIGHT = "#c4b5fd";

const DONUT_COLORS = [
  "#7c3aed","#f97316","#a855f7","#fb923c","#6d28d9",
  "#ea580c","#8b5cf6","#c4b5fd","#fed7aa","#ddd6fe","#ffedd5","#e9d5ff"
];

const card = {
  background: "#fff",
  borderRadius: 12,
  padding: "16px 20px",
  border: "1px solid #ede9fe",
};

export default function Turnover() {
  const [selected, setSelected] = useState("all");

  const isAll = selected === "all";
  const company = companies.find(c => c.org_name === selected);

  const stats = isAll ? turnoverStats : {
    totalEmployees: company.total,
    activeEmployees: company.active,
    totalLeavers: company.leavers,
    churnRate: company.churn,
  };

  const industryAvg = isAll ? turnoverStats.industryAvgChurn : (industryAverages[company?.industry] ?? 18.0);

  // Tenure chart — same for all (we only have overall data)
  const tenureData = leaversByTenure;

  // Industry chart — overall donut OR company vs industry avg bar
  const industryChartData = isAll
    ? leaversByIndustry
    : [
        { name: company.org_name.split(" ").slice(0, 3).join(" "), churn: company.churn, fill: PURPLE },
        { name: `${company.industry} avg`, churn: industryAvg, fill: ORANGE },
        { name: "Overall avg", churn: turnoverStats.churnRate, fill: PURPLE_LIGHT },
      ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#3b0764" }}>Turnover</h1>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={{ fontSize: 13, padding: "6px 12px", borderRadius: 8, border: "1px solid #ede9fe", color: "#3b0764", background: "#fff", cursor: "pointer", maxWidth: 300 }}
        >
          <option value="all">All Companies</option>
          {companies.map(c => (
            <option key={c.org_name} value={c.org_name}>{c.org_name}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <div style={card}>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Total Employees</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: PURPLE }}>{stats.totalEmployees.toLocaleString()}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Active Employees</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: PURPLE }}>{stats.activeEmployees.toLocaleString()}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Total Leavers</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: ORANGE }}>{stats.totalLeavers.toLocaleString()}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Churn Rate</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: stats.churnRate > industryAvg ? "#ef4444" : PURPLE }}>
            {stats.churnRate}%
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>
            {isAll ? `Industry avg: ${turnoverStats.industryAvgChurn}%` : `${company.industry} avg: ${industryAvg}%`}
          </div>
        </div>
      </div>

      {/* Line Chart — only show for all companies */}
      {isAll && (
        <div style={card}>
          <div style={{ fontWeight: 500, marginBottom: 8, color: "#3b0764" }}>Active employees vs leavers over time</div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: PURPLE, borderRadius: 2, marginRight: 4 }}></span>Active</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: ORANGE, borderRadius: 2, marginRight: 4 }}></span>Leavers</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={2} angle={-30} textAnchor="end" height={45} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={v => v.toLocaleString()} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => v.toLocaleString()} />
              <Line yAxisId="left" type="monotone" dataKey="active" stroke={PURPLE} strokeWidth={2} dot={false} name="Active" />
              <Line yAxisId="right" type="monotone" dataKey="leavers" stroke={ORANGE} strokeWidth={2} dot={false} name="Leavers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* Leavers by tenure */}
        <div style={card}>
          <div style={{ fontWeight: 500, marginBottom: 12, color: "#3b0764" }}>Leavers by time under contract</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tenureData}>
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => v.toLocaleString()} />
              <Bar dataKey="value" name="Leavers" radius={[4, 4, 0, 0]}>
                {tenureData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? PURPLE : PURPLE_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Industry chart — donut for all, comparison bar for company */}
        <div style={card}>
          <div style={{ fontWeight: 500, marginBottom: 12, color: "#3b0764" }}>
            {isAll ? "Leavers by industry" : `${company.org_name.split(" ").slice(0,3).join(" ")} vs industry`}
          </div>

          {isAll ? (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie data={leaversByIndustry} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                    {leaversByIndustry.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => v.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, fontSize: 11, color: "#6b7280" }}>
                {leaversByIndustry.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }}></span>
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <span style={{ fontWeight: 500, color: "#374151" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
                Churn rate comparison — {company.industry} industry
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={industryChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[0, 'auto']} />
                  <Tooltip formatter={v => `${v}%`} />
                  <ReferenceLine y={industryAvg} stroke={ORANGE} strokeDasharray="4 4" label={{ value: `Industry avg ${industryAvg}%`, fontSize: 10, fill: ORANGE }} />
                  <Bar dataKey="churn" radius={[4, 4, 0, 0]} name="Churn Rate">
                    {industryChartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, textAlign: "center" }}>
                Industry: {company.industry} · Overall platform avg: {turnoverStats.churnRate}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}