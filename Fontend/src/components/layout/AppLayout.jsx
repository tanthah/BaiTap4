import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <header style={{ padding: "20px", background: "#001529", color: "white" }}>
        <h2>My App</h2>
      </header>
      
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}