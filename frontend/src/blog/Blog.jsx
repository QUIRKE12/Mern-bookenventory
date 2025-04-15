import React from 'react';
import post from '/assets/books.jpg';
import postImage from "/assets/awar.png";
import postImag from "/assets/profile.jpeg";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-24 py-16">
      {/* Blog Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-blue-700 mb-4">
          Welcome to Our Blog
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Stay updated with the latest news, tips, and insights from the world of books, reading habits, and the book-selling community.
        </p>
      </section>

      {/* Featured Blog Posts */}
      <section className="mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 text-center mb-6">
          Featured Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={postImage}
              alt="Post Image"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">The Future of Reading</h3>
            <p className="text-gray-600 mb-4">
              Discover how technology is changing the way we read books and what it means for future generations of readers.
            </p>
            <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold">
              Read More →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={post}
              alt=""
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">Top 10 Must-Read Books for 2025</h3>
            <p className="text-gray-600 mb-4">
              A list of exciting books to look out for in 2025—whether you're into fiction, non-fiction, or fantasy.
            </p>
            <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold">
              Read More →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={postImag}
              alt="Post Image"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">The Benefits of Buying Second-Hand Books</h3>
            <p className="text-gray-600 mb-4">
              Learn about the environmental and financial benefits of buying pre-loved books and how it contributes to sustainability.
            </p>
            <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold">
              Read More →
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 text-center mb-6">
          Browse By Category
        </h2>
        <div className="flex justify-center space-x-8">
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-xl">
            Fiction
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-xl">
            Non-fiction
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-xl">
            Lifestyle
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-xl">
            Reviews
          </a>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="bg-blue-100 py-12 text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 mb-4">
          Stay Updated
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          Subscribe to our newsletter to get the latest blog posts, book recommendations, and exclusive deals delivered straight to your inbox.
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="px-6 py-3 rounded-full w-2/3 sm:w-1/2 text-lg mb-4 border-2 border-gray-300"
        />
        <button className="bg-blue-700 text-white px-8 py-3 rounded-full hover:bg-blue-800 transition-all duration-300">
          Subscribe Now
        </button>
      </section>
    </div>
  );
};

export default Blog;
