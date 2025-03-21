// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { FaCartShopping } from "react-icons/fa6";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import required modules
import { Pagination } from "swiper/modules";

const BookCards = ({ headline, books }) => {
  // console.log(books); // Debugging

  return (
    <div className="my-16 px-4 lg:px-24">
      <h2 className="text-5xl text-center font-bold text-black my-5">{headline}</h2>

      {/* Cards */}
      <div>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 40 },
            1024: { slidesPerView: 5, spaceBetween: 50 },
          }}
          modules={[Pagination]}
          className="mySwiper w-full h-full"
        >
          {books.map((book) => (
            <SwiperSlide key={book._id}>
              <Link to={`/book/${book._id}`}> {/* Navigate to book details */}
                <div className="relative">
                  <img src={book.imageURL} alt={book.title} className="w-full h-64 object-cover rounded-lg" />
                  <div className="absolute top-3 right-3 bg-blue-600 hover:bg-black p-2 rounded">
                    <FaCartShopping className="w-4 h-4 text-white"/>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  <p>{book.authName}</p>
                  <div>
                    <p>$10.00</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BookCards;
