import Banner from "./Banner";
import BestSellerProducts from "./BestSellerProducts";
import FavProducts from "./FavProducts";

const Home = () => {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Banner />
      <BestSellerProducts />
      <FavProducts />
    </div>
  );
};

export default Home;
