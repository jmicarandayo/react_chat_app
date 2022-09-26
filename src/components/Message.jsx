import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {
  const [ isNow, setIsNow ] = useState(false)
  
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();
  useEffect(()=> {
    const dateNow = Timestamp.now().toMillis();
    const messageDate = message.date.toMillis();
    setIsNow(dateNow - messageDate > 120000 ? false : true)
  },[message.date])
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:'smooth'})
  }, [message])
  return (
    <div ref={ref} className={`flex gap-5 mb-4 ${message.senderId === currentUser.uid &&'flex-row-reverse'}`}>
      <div className='flex flex-col'>
        <img className='h-[40px] w-[40px] rounded-full object-cover' src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="Friend Pic" />
        {isNow && <span className='font-light text-gray-400'>just now</span>}
      </div>
      <div className={`flex flex-col gap-3 max-w-[80%] ${message.senderId === currentUser.uid && 'items-end'}`}>
        {message.text && <p className={`py-2 px-4 rounded-b-lg min-w-fit ${message.senderId === currentUser.uid ? 'bg-indigo-400 rounded-l-lg text-white' : 'bg-white rounded-r-lg'}`}>{message.text}</p>}
        {message.img && <img className='h-[80%]' src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message