import React, { use } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useState } from 'react'
import { useEffect } from 'react'
import Title from './Title'
import ProductItem from './productItem'

const Reletedproduct = ({category, subCategory}) => {

 const { products } = useContext(ShopContext);
 const [reletedProduct, setReletedProduct] = useState([]);

 useEffect(() => {
    if (products.length > 0) {
        let productsCopy = [...products];
      const filteredProducts = products.filter((item) => category === category);
      productsCopy = productsCopy.filter((item) => subCategory === subCategory);
        setReletedProduct(productsCopy.slice(0, 4));
        
    }
 },[products])

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={'RELATED'} text2={'PRODUCT'} />
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6'>
           {
             reletedProduct.map((item, index) => (
                <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image}  />
             ))
           }
        </div>
      
    </div>
  )
}

export default Reletedproduct
