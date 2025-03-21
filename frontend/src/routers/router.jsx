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
import SideBar from "../dashboard/SideBar";
import Login from "../components/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Logout from "../components/Logout";

// Fetching Book Data Before Edit Page Loads
const fetchBookData = async ({ params }) => {
  try {
    const res = await fetch(`http://localhost:5000/books/${params.id}`);
    if (!res.ok) throw new Error("Failed to load book data");
    return res.json();
  } catch (error) {
    console.error("Error loading book:", error);
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
      { path: "/singlebook", element: <SingleBook /> },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: "upload", element: <PrivateRoute><UploadBook /></PrivateRoute> },
      { path: "manage", element: <PrivateRoute><ManageBooks /></PrivateRoute> },
      { path: "sidebar", element: <PrivateRoute><SideBar /></PrivateRoute> },
      {
        path: "edit-books/:id",
        element: <PrivateRoute><EditBooks /></PrivateRoute>,
        loader: fetchBookData, // Use the function for better error handling
      },
    ],
  },
  { path: "/sign-up", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> }
]);

export default router;
