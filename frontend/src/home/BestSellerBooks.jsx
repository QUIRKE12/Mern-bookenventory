import { useEffect, useState } from "react";
import ProductCards from "../components/ProductCards";

const BestSellerProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/all-products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 8)));
  }, []);

  return (
    <div className="px-4 lg:px-24 my-16">
      <ProductCards products={products} headline="Best Seller Products" />
    </div>
  );
};

export default BestSellerProducts;
