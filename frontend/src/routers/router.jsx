import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Import components
import Home from "../home/Home";
import Shop from "../shop/Shop";
import SingleBook from "../components/SingleBook";
import Signup from "../components/Signup";

// Dashboard imports
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import UploadBook from "../dashboard/UploadBook";
import ManageBooks from "../dashboard/ManageBooks";
import EditBooks from "../dashboard/EditBooks";
import Login from "../components/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Logout from "../components/Logout";
import About from "../about/About";
import Blog from "../blog/Blog";
import NotFound from "../components/NotFound";

// Fetching Book Data Before Edit Page Loads
const API_URL = import.meta.env.VITE_API_URL;

const fetchBookData = async ({ params }) => {
  try {
    const res = await fetch(`${API_URL}/books/${params.id}`);
    if (!res.ok) throw new Error("Failed to load book data");
    return res.json();
  } catch (error) {
    console.error("Error loading book:", error);
    return null;
  }
};

const router = createBrowserRouter([
  // ✅ Main layout with Navbar and Footer
  {
    path: "/",
    element: <App />, 
    children: [
      { path: "/", element: <Home /> },
      { path: "/shop", element: <Shop /> },
      { path: "/singlebook", element: <SingleBook /> },
      { path: "/about", element: <About /> },
      { path: "/blog", element: <Blog /> },
    ],
  },

  // ✅ Signup & Login (without Navbar & Footer)
  { path: "/sign-up", element: <Signup /> }, // ❌ Moved OUTSIDE App
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> },

  // ✅ Dashboard Layout (Private)
  {
    path: "/admin",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "upload", element: <UploadBook /> },
      { path: "manage", element: <ManageBooks /> },
      { path: "edit-books/:id", element: <EditBooks />, loader: fetchBookData },
    ],
  },

  // ✅ 404 Not Found Page
  { path: "*", element: <NotFound /> },
]);

export default router;
