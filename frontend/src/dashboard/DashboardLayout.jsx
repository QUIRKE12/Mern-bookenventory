import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 ml-48 p-4">
        <Outlet /> {/* This will render the child routes */}
      </div>
    </div>
  );
};

export default DashboardLayout;
