import React from 'react'
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className='min-h-[60px] bg-[#2f2d52] flex justify-between items-center p-4 text-gray-100'>
      <h1 className='font-extrabold text-lg'>King's Chat</h1>
      <div className='flex items-center gap-3'>
        <img className='h-[25px] w-[25px] object-cover rounded-full' src={currentUser.photoURL} alt="Unavailable" />
        <span className=''>{currentUser.displayName}</span>
        <button className='p-1 bg-[#5d5b8d] text-xs' onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar