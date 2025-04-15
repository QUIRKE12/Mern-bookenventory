import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-24 py-16">
      {/* About Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-blue-700 mb-4">
          About Us
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Welcome to <strong>Kelly Groups Books Campany</strong>, your one-stop destination for buying and selling books at the best prices! We are passionate about connecting book lovers with a vast collection of books, making reading more accessible and affordable.
        </p>
      </section>

      {/* Mission Section */}
      <section className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 mb-4">
          Our Mission
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our mission is to create a seamless experience for book enthusiasts by providing a platform where they can:
        </p>
        <ul className="list-disc list-inside text-lg text-gray-600 mt-4 mx-auto max-w-2xl">
          <li>Buy new and pre-loved books at the best deals</li>
          <li>Sell their books and earn money</li>
          <li>Discover new reads across various genres</li>
        </ul>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-blue-100 py-12 mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 text-center mb-6">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-700">Affordable Prices</h3>
            <p className="text-gray-600">Get books at competitive rates that fit your budget.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-700">Wide Collection</h3>
            <p className="text-gray-600">Fiction, non-fiction, textbooks, and more to explore.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-700">Easy Selling Process</h3>
            <p className="text-gray-600">List your books in just a few clicks and earn from your shelf.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-700">Secure & Reliable</h3>
            <p className="text-gray-600">Ensuring safe and trustworthy transactions every time.</p>
          </div>
        </div>
      </section>

      {/* Join Our Community Section */}
      <section className="text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 mb-4">
          Join Our Community
        </h2>
        <p className="text-lg text-gray-600 mb-4 max-w-3xl mx-auto">
          Become part of our growing community of readers and book traders. Whether you're looking for your next favorite book or want to declutter your shelf, <strong>Kelly Groups Books Campany</strong> is here to help!
        </p>
        <button className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition-all duration-300">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default About;
