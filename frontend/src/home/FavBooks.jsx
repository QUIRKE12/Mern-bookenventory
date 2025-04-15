import { Link } from "react-router-dom";
import books from "/assets/books.jpg";

const FavBooks = () => {
  return (
    <div className="px-4 lg:px-24 my-20">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img src={books} alt="books" className="rounded-lg w-full max-w-sm shadow-lg" />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
            Find Your Favorite <span className="text-blue-700">Book Here</span>
          </h2>
          <p className="text-lg text-gray-600">
            Discover a wide collection of books across different genres. Explore our listings, register as a user, and download PDFs with ease.
          </p>

          <div className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-700">800+</h3>
              <p className="text-sm md:text-base text-gray-600">Book Listings</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-green-700">550+</h3>
              <p className="text-sm md:text-base text-gray-600">Registered Users</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-red-700">1200+</h3>
              <p className="text-sm md:text-base text-gray-600">PDF Downloads</p>
            </div>
          </div>

          <Link to="/shop" className="mt-12 block">
            <button className="bg-blue-700 text-white font-semibold px-5 py-2 rounded hover:bg-black transition-all duration-300">
              Explore More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavBooks;
