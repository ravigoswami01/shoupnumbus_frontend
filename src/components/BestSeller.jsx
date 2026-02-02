import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './productItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        if (Array.isArray(products)) {
          const filtered = products
            .filter((product) => product.bestSeller === true)
            .slice(0, 5);
          setBestSeller(filtered);
        }
      }, [products]);

    return (
        <div className="my-12 px-4 sm:px-6 md:px-10 bg-white">
            <div className="text-center py-10">
                <Title text1={"BEST"} text2={"SELLER"} />
                <p className="w-full max-w-3xl mx-auto text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
                    Discover the most popular products that our customers love. These top picks are selling fast, so grab yours before they're gone!
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {bestSeller.length === 0 ? (
                    <p className="text-center w-full col-span-full text-gray-500 text-lg py-10">
                        Loading best sellers...
                    </p>
                ) : (
                    bestSeller.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl shadow hover:shadow-lg transition duration-300 p-3"
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

export default BestSeller;
