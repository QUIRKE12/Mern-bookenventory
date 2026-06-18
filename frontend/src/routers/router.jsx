{
  path: "/admin",
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [...]
}
/*
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
// Import components
import Home from "../home/Home";
import Shop from "../shop/Shop";
import SingleProduct from "../components/SingleProduct";
import Signup from "../components/Signup";
import Orders from "../components/Orders";
// Dashboard imports
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import UploadProduct from "../dashboard/UploadProduct";
import ManageProducts from "../dashboard/ManageProducts";
import EditProduct from "../dashboard/EditProduct";
import GigoManagement from "../dashboard/GigoManagement";
import Login from "../components/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Logout from "../components/Logout";
import About from "../about/About";
import Blog from "../blog/Blog";
import NotFound from "../components/NotFound";

const API_URL = import.meta.env.VITE_API_URL;

const fetchProductData = async ({ params }) => {
  try {
    const res = await fetch(`${API_URL}/products/${params.id}`);
    if (!res.ok) throw new Error("Failed to load product data");
    return res.json();
  } catch (error) {
    console.error("Error loading product:", error);
    return null;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/shop", element: <Shop /> },
      { path: "/product/:id", element: <SingleProduct />, loader: fetchProductData },
      { path: "/about", element: <About /> },
      { path: "/blog", element: <Blog /> },
      { path: "/orders", element: <Orders /> },
    ],
  },
  { path: "/sign-up", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "upload", element: <UploadProduct /> },
      { path: "manage-products", element: <ManageProducts /> },
      {
        path: "edit-product/:id",
        element: <EditProduct />,
        loader: fetchProductData,
      },
    ],
  },
  // GigoManagement - standalone, outside DashboardLayout
  {
    path: "/admin/management",
    element: (
      <PrivateRoute>
        <GigoManagement />
      </PrivateRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

export default router;

