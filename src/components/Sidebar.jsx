const navItems = [
  { id: "overview", label: "NDA Tracker", icon: "📊" },
  { id: "turnover", label: "Turnover",    icon: "📉" },
  { id: "reports",  label: "Reports",     icon: "📄" },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside style={{ width: 210, background: "#42177B", color: "#fff", display: "flex", flexDirection: "column", padding: "24px 0" }}>

      {/* Logo */}
      <div style={{ padding: "0 20px 28px" }}>
        <img src="/Logo.jpg" alt="The HR Company" style={{ width: "100%", maxWidth: 160 }} />
      </div>

      {/* Nav items */}
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActivePage(item.id)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 20px", border: "none", cursor: "pointer",
            background: activePage === item.id ? "#FE7C16" : "transparent",
            color: activePage === item.id ? "#fff" : "#aaa",
            fontSize: 14, textAlign: "left",
            borderLeft: activePage === item.id ? "3px solid #7c3aed" : "3px solid transparent"
          }}
        >
          {item.icon} {item.label}
        </button>


      ))}
       <div
  style={{
    marginTop: "auto",
    padding: "0 20px 24px",
    fontWeight: 600,
    fontSize: 16,
  }}
>
  POSSIBLE CLIENT FACING DASHBOARD
</div>
    </aside>
  );
}
