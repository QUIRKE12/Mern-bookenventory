import React from "react";
import { HiUsers, HiBookOpen, HiShoppingBag, HiCash, HiPlusCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">📊 Admin Dashboard</h1>
        <p className="text-gray-600">Manage books, users, and track business performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4">
          <HiUsers className="text-blue-500 text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-gray-600">1,245</p>
          </div>
        </div>

        {/* Books */}
        <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4">
          <HiBookOpen className="text-green-500 text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Total Books</h2>
            <p className="text-gray-600">320</p>
          </div>
        </div>

        {/* Orders */}
        <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4">
          <HiShoppingBag className="text-yellow-500 text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Total Orders</h2>
            <p className="text-gray-600">812</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4">
          <HiCash className="text-red-500 text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <p className="text-gray-600">$24,560</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Activity */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">📢 Recent Activity</h2>
          <ul className="text-gray-600 space-y-2">
            <li>📚 New book added: <strong>"The Art of React"</strong></li>
            <li>👤 New user registered: <strong>John Kelly</strong></li>
            <li>🛒 Order placed by <strong>Kelly Smith</strong></li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">⚡ Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/upload" className="flex items-center space-x-2 text-blue-600">
              <HiPlusCircle className="text-xl" /> <span>Upload New Book</span>
            </Link>
            <Link to="/admin/manage" className="flex items-center space-x-2 text-green-600">
              <HiBookOpen className="text-xl" /> <span>Manage Books</span>
            </Link>
            <Link to="/admin/users" className="flex items-center space-x-2 text-yellow-600">
              <HiUsers className="text-xl" /> <span>Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
