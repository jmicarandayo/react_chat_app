import React from 'react'
import { useEffect, useContext } from 'react'
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { useState } from 'react';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {
  const [ chats, setChats ] = useState([])
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  useEffect(()=> {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        });
        return () => {
          unsub();
        };
    }
    currentUser.uid && getChats();
  }, [currentUser.uid])
  const handleSelect = (u) => {
    dispatch({type:"CHANGE_USER", payload:u})
  }
  return (
    <div>
      {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map(chat => (
        <div className='flex items-center gap-5 hover:bg-[#2f2d52] p-2 text-gray-200 cursor-pointer' key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
        <img className='h-[50px] w-[50px] object-cover rounded-full' src={chat[1].userInfo.photoURL} alt="Searched User" />
        <div>
          <span className='font-bold text-lg'>{chat[1].userInfo.displayName}</span>
          <p className='text-sm text-gray-300'>{chat[1].lastMessage?.text}</p>
        </div>
      </div>
      ))}
    </div>
  )
}

export default Chats