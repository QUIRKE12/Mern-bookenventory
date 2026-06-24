import { useLoaderData } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

const SingleProduct = () => {
  const product = useLoaderData();
  const { t } = useContext(LanguageContext);

  return (
    <div className="min-h-screen px-4 lg:px-24 py-24">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div>
            <img src={product?.imageURL} alt={product?.productName} className="w-full rounded-lg" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-700 mb-4">{product?.productName}</h1>
            <p className="text-gray-600 mb-4">{t("category")}: {product?.category}</p>
            <p className="text-2xl font-semibold text-green-600 mb-4">{product?.price} BIF</p>
            <p className="text-gray-700 mb-6">{product?.description}</p>
            <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition">
              {t("buyNow")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
