import React from 'react'
import { RiImageAddLine } from "react-icons/ri";
import { BsPaperclip } from "react-icons/bs";
import { useContext } from 'react';
import { useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const [ text, setText ] = useState('');
  const [ img, setImg ] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async() => {
    if(img) {
      const storageRef = ref(storage, uuidv4());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
        (error) => {
          // Handle unsuccessful uploads
          // setError(true)
          console.log(error)
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            console.log('File available at', downloadURL);
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuidv4(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL
              })
            })
          });
        }
      );
    } else {
      if(text === '') return;
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      })
    }
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId+'.lastMessage'] : {
        text
      },
      [data.chatId+'.date']: serverTimestamp()
    });
    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId+'.lastMessage'] : {
        text
      },
      [data.chatId+'.date']: serverTimestamp()
    });
    setImg(null);
    setText('');
  }
  return (
    <div className='min-h-[60px] bg-white flex justify-between items-center p-4'>
      <input className='outline-none w-full placeholder:text-gray-400' type="text" placeholder='Type something...' onChange={(e) => setText(e.target.value)} value={text}/>
      <div className='flex gap-3 items-center'>
        <input className='hidden' type="file" id='file' onChange={(e) => setImg(e.target.files[0])}/>
        <label htmlFor="file" className='flex gap-2'>
        <BsPaperclip className='cursor-pointer' size={22}/>
        <RiImageAddLine className='cursor-pointer' size={22}/>
        </label>
        <button className='py-2 px-4 bg-indigo-400 text-white' onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input