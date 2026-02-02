import React, { use } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const Searchbar = () => {

    const { search, setSearch,showSearch, setShowSearch, } = useContext(ShopContext);
    const location = useLocation();
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        if (location.pathname.includes('collection') ) {
            setVisible(true);
         }
         else{
            setVisible(false);
         }
    }, [location.pathname, setShowSearch]);


  return showSearch && visible ?(
    <div className=' border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 rounded-full w-3/4 sm:1/2'>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" className='flex-1 outline-none bg-inherit text-sm' placeholder='search ' />
        <img src={assets.search_icon} alt="search" className='w-4' onClick={()=>setShowSearch(false)}/>
        </div>
        <img onClick={()=>setShowSearch(false)} src={assets.cross_icon} className='inline w-3 cursor-pointer' />
      
    </div>
  ):null
}

export default Searchbar
