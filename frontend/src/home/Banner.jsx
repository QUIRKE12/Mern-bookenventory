import BarnnerCard from "./BarnnerCard";

const Banner = () => {
  return (
    <div className="px-4 lg:px-24 bg-teal-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 py-20 w-full">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug text-black">
            Kaze muri{" "}
            <span className="text-blue-700">
              GIGO COMPANY LIMITED
            </span>
          </h2>
          <p className="md:w-4/5 text-gray-600">
            Turabashikiriza ibinyobwa vyiza kandi vyizewe ku giciro kibereye
            bose. Turafise ibinyobwa vyambiye n'ibitambiye vy'ubwoko
            butandukanye kandi biboneka hafi yawe.
          </p>
          <div className="flex w-full max-w-md">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Rondera ikinyobwa..."
              className="py-2 px-2 w-full border border-gray-300 rounded-l-md outline-none"
            />
            <button className="bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black transition-all ease-in duration-200 rounded-r-md">
              Rondera
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <BarnnerCard />
        </div>
      </div>
    </div>
  );
};

export default Banner;
