import React from 'react'
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from './Title';

const CartTotal = () => {
    const {cardItems , currency , deliveryFee ,getCartTotalAmount} = useContext(ShopContext)
     
  return (
    <div className='w-full'>

        <div className='text-2xl'>
            <Title text1={"CART"} text2={"TOTAL"}/>
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>SubTotal</p>
                <p>{currency}{getCartTotalAmount()}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Delivery Fee</p>
                <p>{currency}{deliveryFee}</p>

            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Total</p>
                <p>{currency}{getCartTotalAmount() === 0 ? 0 : getCartTotalAmount() + deliveryFee}</p>
            </div>

        </div>
      
    </div>
  )
}

export default CartTotal
