import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <h1 className="text-7xl font-bold text-red-600 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Oops! Uru rupapuro ntirubonetse.
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Muradusavye imbabazi. Uru rupapuro ntirubaho canke rwimuwe.
      </p>
      <Link
        to="/"
        className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
      >
        Subira Ahabanza
      </Link>
    </div>
  );
};

export default NotFound;
