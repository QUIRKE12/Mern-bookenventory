import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import MyFooter from "./components/MyFooter";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="gigo-layout min-h-screen">
        <Outlet />
      </div>
      <MyFooter />
    </>
  );
}

export default App;
