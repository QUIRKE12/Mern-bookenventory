import React from "react";
import Banner from "../components/Banner";
import BestSellerBooks from "./BestSellerBooks";
import FavBooks from "./FavBooks";
import PromoBanner from "./PromoBanner";
import OtherBooks from "./OtherBooks";
import Review from "./Review";
import Navbar from "../components/Navbar"; // Import Navbar

const Home = () => {
  return (
    <>
      <Navbar /> {/* Navbar only for home page */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Banner />
          <BestSellerBooks />
          <FavBooks />
          <PromoBanner />
          <OtherBooks />
          <Review />
        </div>
      </div>
    </>
  );
};

export default Home;
