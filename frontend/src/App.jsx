import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import MyFooter from "./components/MyFooter";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet /> {/* This will render the current page */}
      </div>
      <MyFooter />
    </>
  );
}

export default App;
