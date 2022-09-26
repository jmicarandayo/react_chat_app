import React from 'react'
import { collection, query, where, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp  } from "firebase/firestore";
import { useState } from 'react';
import { db } from '../firebase';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
  const [ username, setUsername ] = useState('');
  const [ user, setUser ] = useState(null)
  const [ error, setError ] = useState(false);
  const { currentUser } = useContext(AuthContext)

  const handleSearch = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where('displayName', '==', username))
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
      setUser(doc.data())
      });
    } catch(err) {
      setError(true)
    }
  }

  const handleEnter = (e) => {
    e.code === 'Enter' && handleSearch();
  }
  const handleSelect = async() => {
    // Check whether the group(chats in firestore) exists or not
    const combinedId = 
    currentUser.uid > user.uid
     ? currentUser.uid + user.uid
     : user.uid + currentUser.uid;
    try{
      const res = await getDoc(doc(db, 'chats', combinedId));
      if(!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), {messages:[]});

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId+'.userInfo']:{
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId+'.date']: serverTimestamp()
        });
        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId+'.userInfo']:{
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId+'.date']: serverTimestamp()
        });
      }
    } catch(err) {}
    setUser(null)
    setUsername('')
  };
  return (
    <div className='text-gray-300 border-b-[1px] border-gray-500'>
      <input className='placeholder:text-gray-200 w-full outline-none bg-transparent border-slate-50 p-2' type="text"  placeholder='Find a user' onChange={(e) => setUsername(e.target.value)} onKeyDown={handleEnter} value={username}/>
      { error && <span>Can't find user!</span>}
      {user && 
        <div className='cursor-pointer flex items-center gap-5 hover:bg-[#2f2d52] p-2' onClick={handleSelect}>
          <img className='h-[50px] w-[50px] object-cover rounded-full' src={user.photoURL} alt="Searched User" />
          <span className='font-bold text-lg'>{user.displayName}</span>
        </div>
      }
    </div>
  )
}

export default Search