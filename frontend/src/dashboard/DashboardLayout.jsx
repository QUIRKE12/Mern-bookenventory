import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const DashboardLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0D1B2A",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <SideBar />
      <main
        style={{
          flex: 1,
          marginLeft: "220px",
          padding: "24px",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
