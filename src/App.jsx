import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Turnover from "./pages/Turnover";

export default function App() {
  const [activePage, setActivePage] = useState("overview");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flex: 1, overflowY: "auto", background: "#f5f5f5", padding: "24px" }}>
        {activePage === "overview" && <Overview />}
        {activePage === "turnover" && <Turnover />}
      </main>
    </div>
  );
}