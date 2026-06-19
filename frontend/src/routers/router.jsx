import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import SingleProduct from "../components/SingleProduct";
import Signup from "../components/Signup";
import Orders from "../components/Orders";
import DashboardLayout from "../dashboard/DashboardLayout";
import UploadProduct from "../dashboard/UploadProduct";
import ManageProducts from "../dashboard/ManageProducts";
import EditProduct from "../dashboard/EditProduct";
import GigoManagement from "../dashboard/GigoManagement";
import Login from "../components/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import ManagerRoute from "../PrivateRoute/ManagerRoute";
import OwnerRoute from "../PrivateRoute/OwnerRoute";
import Unauthorized from "../PrivateRoute/Unauthorized";
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
  { path: "/unauthorized", element: <Unauthorized /> },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <Navigate to="/admin/management" replace /> },
      { path: "upload", element: <OwnerRoute><UploadProduct /></OwnerRoute> },
      { path: "manage-products", element: <ManagerRoute><ManageProducts /></ManagerRoute> },
      {
        path: "edit-product/:id",
        element: <OwnerRoute><EditProduct /></OwnerRoute>,
        loader: fetchProductData,
      },
    ],
  },
  {
    path: "/admin/management",
    element: (
      <ManagerRoute>
        <GigoManagement />
      </ManagerRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
