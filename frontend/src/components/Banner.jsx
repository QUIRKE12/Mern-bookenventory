import BarnnerCard from "../home/BarnnerCard";

const Banner = () => {
  return (
    <div className="px-4 lg:px-24 bg-teal-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 py-20 w-full">
        {/* Left Side */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug text-black">
            Buy and Sell Your Books{" "}
            <span className="text-blue-700">for the Best Prices</span>
          </h2>
          <p className="md:w-4/5 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Qui quam minus iure voluptatibus, commodi doloremque harum dolores magnam iusto, voluptas debitis eum inventore dolorum sed alias obcaecati ex, tempore deserunt?
          </p>
          <div className="flex w-full max-w-md">
            <input 
              type="search"
              name="search"
              id="search"
              placeholder="Search a book"
              className="py-2 px-2 w-full border border-gray-300 rounded-l-md outline-none"
            />
            <button className="bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black transition-all ease-in duration-200 rounded-r-md">
              Search
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex justify-center">
          <BarnnerCard />
        </div>
      </div>
    </div>
  );
};

export default Banner;
