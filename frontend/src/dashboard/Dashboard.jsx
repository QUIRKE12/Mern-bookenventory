import React from "react";
import {
  HiUsers,
  HiShoppingBag,
  HiCash,
  HiPlusCircle,
  HiCube,
} from "react-icons/hi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          📊 GIGO COMPANY Dashboard
        </h1>
        <p className="text-gray-600">
          Gucunga ibinyobwa, abakiriya, n'ibikorwa vy'ubudandaji.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4">
          <HiUsers className="text-blue-500 text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Abakiriya</h2>
            <p className="text-gray-600">1,245</p>
          </div>
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4">
          <HiCube className="text-green-500 text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Ibinyobwa</h2>
            <p className="text-gray-600">320</p>
          </div>
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4">
          <HiShoppingBag className="text-yellow-500 text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Amakomande</h2>
            <p className="text-gray-600">812</p>
          </div>
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4">
          <HiCash className="text-red-500 text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Amahera Yinjiye</h2>
            <p className="text-gray-600">24,560,000 BIF</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">
            📢 Ibikorwa Biheruka
          </h2>
          <ul className="text-gray-600 space-y-2">
            <li>🍾 Ikinyobwa gishasha congewe muri sisiteme</li>
            <li>👤 Umukiriya mushasha yiyandikishije</li>
            <li>🛒 Komande nshasha yakiriwe</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">
            ⚡ Ibikorwa Vyihuta
          </h2>
          <div className="flex flex-col space-y-3">
            <Link
              to="/admin/upload"
              className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              <HiPlusCircle className="text-xl" />
              Ongeraho Ikinyobwa Gishasha
            </Link>
            <Link
              to="/admin/manage-products"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <HiCube className="text-xl" />
              Gucunga Ibinyobwa
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              <HiShoppingBag className="text-xl" />
              Reba Amakomande
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
