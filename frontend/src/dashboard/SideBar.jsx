import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiOutlineCloudUpload, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/profile.jpeg"; // Default image for users without profile pictures

const SideBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      alert("User logged out successfully");
      navigate("/", { replace: true }); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-screen w-56 bg-gray-100 text-gray-800 shadow-md fixed sm:w-64 md:w-72 lg:w-80">
        <Sidebar aria-label="Sidebar with navigation">
          {/* Profile Section */}
          <div className="flex items-center pl-4 py-4 space-x-2 border-b">
            <img
              src={user?.photoURL || defaultProfile} // Use Firebase's photoURL or default image
              alt="User Profile"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <h2 className="text-sm font-medium">
              {user?.displayName || "Guest User"} {/* Show name if available */}
            </h2>
          </div>

          {/* Navigation */}
          <Sidebar.Items className="space-y-1">
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/admin/dashboard" icon={HiChartPie} className="rounded-md p-2">
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="/admin/upload" icon={HiOutlineCloudUpload} className="rounded-md p-2">
                Upload Book
              </Sidebar.Item>
              <Sidebar.Item href="/admin/manage" icon={HiInbox} className="rounded-md p-2">
                Manage Books
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiUser} className="rounded-md p-2">
                Users
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiShoppingBag} className="rounded-md p-2">
                Products
              </Sidebar.Item>
              
              {/* Logout Button with Click Event */}
              <div
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 cursor-pointer rounded-md p-2 hover:bg-red-100 transition duration-300"
              >
                <HiArrowSmRight className="text-xl" />
                <span>Log Out</span>
              </div>

              <Sidebar.Item href="/sign-up" icon={HiTable} className="rounded-md p-2">
                Sign Up
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {/* Content Area */}
      <div className="flex-1 ml-56 p-6 sm:ml-64 md:ml-72 lg:ml-80">
        {/* The content area (Make sure to add margin-left to avoid sidebar overlap) */}
      </div>
    </div>
  );
};

export default SideBar;
