import { Link } from "react-router-dom";
import awar from "../assets/awar.png";

const PromoBanner = () => {
  return (
    <div className="mt-16 py-12 bg-teal-100 px-4 lg:px-24">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900">
            2023 National Book Awards for Fiction Shortlist
          </h2>
          <Link to="/shop" className="mt-6 inline-block">
            <button className="bg-blue-700 text-white font-semibold px-5 py-2 rounded hover:bg-black transition-all duration-300">
              Get Promo Code
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="mt-6 md:mt-0">
          <img src={awar} alt="Award Image" className="w-96 rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
