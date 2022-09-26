import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'


const Home = () => {
  return (
    <div className='h-screen w-screen bg-indigo-300 flex justify-center items-center'>
      <div className='flex border-2 h-[80%] w-[65%] rounded-xl overflow-hidden'>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Home