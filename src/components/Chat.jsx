import React from 'react'
import { BsFillCameraVideoFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import Messages from './Messages';
import Input from './Input';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className=' basis-2/3 flex flex-col'>
      <div className='min-h-[60px] bg-[#5d5b8d] flex justify-between items-center p-4 text-gray-200'>
        <span>{data.user?.displayName}</span>
        <div className='flex items-center gap-5'>
          <BsFillCameraVideoFill className='text-gray-200 cursor-pointer' size={20}/>
          <FaUserPlus className='text-gray-200 cursor-pointer' size={20}/>
          <BiDotsHorizontalRounded className='text-gray-200 cursor-pointer' size={20}/>
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat