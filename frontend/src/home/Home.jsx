import Banner from "./Banner";
import BestSellerProducts from "./BestSellerProducts";
import OtherProducts from "./OtherProducts";
import PromoBanner from "./PromoBanner";

const Home = () => {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Banner />
      <BestSellerProducts />
      <PromoBanner />
      <OtherProducts />
    </div>
  );
};

export default Home;
