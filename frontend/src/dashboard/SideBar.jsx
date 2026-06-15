import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiOutlineCloudUpload,
  HiShoppingBag,
  HiUser,
} from "react-icons/hi";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg fixed">
      <Sidebar aria-label="Dashboard Sidebar" className="h-full">
        <div className="flex items-center gap-3 p-4 border-b">
          <img
            src={user?.photoURL || "/assets/salvator.jpg"}
            alt="Profile"
            className="w-12 h-12 rounded-full border"
          />
          <div>
            <h2 className="font-semibold">
              {user?.displayName || "Admin"}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.email || "admin@gigo.com"}
            </p>
          </div>
        </div>

        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/admin/dashboard" icon={HiChartPie}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="/admin/upload" icon={HiOutlineCloudUpload}>
              Add Product
            </Sidebar.Item>
            <Sidebar.Item href="/admin/manage-products" icon={HiInbox}>
              Manage Products
            </Sidebar.Item>
            <Sidebar.Item href="/admin/orders" icon={HiShoppingBag}>
              Orders
            </Sidebar.Item>
            <Sidebar.Item href="/admin/users" icon={HiUser}>
              Users
            </Sidebar.Item>
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 p-3 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg"
            >
              <HiArrowSmRight className="text-xl" />
              <span>Logout</span>
            </div>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default SideBar;
