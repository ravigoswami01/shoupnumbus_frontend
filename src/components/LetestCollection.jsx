import { useEffect, useContext } from "react";
import React from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./productItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = React.useState([]);
 
  console.log(products.bestSeller ,"fdbgvb");
  
  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = products
        .filter((product) => product.bestSeller === true)
        .slice(0, 5);
      setLatestProducts(filtered);
    }
  }, [products]);

  return (
    <div className="my-12 px-4 sm:px-6 md:px-10 bg-gray-50">
      <div className="text-center py-10">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Discover our newest arrivals, curated just for you.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {!Array.isArray(latestProducts) || latestProducts.length === 0 ? (
          <p className="text-center w-full col-span-full text-gray-500 text-lg py-10">
            {Array.isArray(products) && products.length > 0
              ? "No bestseller products available."
              : "Loading latest products..."}
          </p>
        ) : (
          latestProducts.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-3 hover:shadow-lg transition duration-300"
            >
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LatestCollection;
