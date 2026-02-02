import React from 'react'
import Hero from '../components/Hero'
import LetestCollection from '../components/LetestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import About from '../pages/About'

const Home = () => {
  return (
    <div>
      <Hero />
      <LetestCollection />
      <BestSeller/>
      <OurPolicy/>
      <About/>
    </div>
  )
}

export default Home
