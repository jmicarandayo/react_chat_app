import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AddAvatar from '../assets/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { registerErrorCheck } from '../utils/errorCheck';
// import { collection, addDoc } from "firebase/firestore"; 

const Register = () => {
  const [ error, setError ] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    if (!displayName) return setError({message:'Please input a display name'})
    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password)
      
      const storageRef = ref(storage, `${displayName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

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
          setError({message:'Something went wrong'})
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            // console.log('File available at', downloadURL);
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            });
            await setDoc(doc(db, "userChats", res.user.uid), {})

            navigate('/')
          });
        }
      );
    } catch(err) {
      setError(registerErrorCheck(err.message.split(' ').pop()))
    }
    
  }

  return (
    <div className='h-screen bg-indigo-300 w-screen flex justify-center items-center p-4'>
        <div className='w-full mx-auto max-w-[450px] text-center bg-white p-6 rounded-lg'>
            <h1 className='text-2xl font-extrabold text-purple-900'>King's Chat</h1>
            <p className='my-2'>Register</p>
            <form action="" className='flex flex-col px-8' onSubmit={handleSubmit}>
            {error && <span className='text-red-600 mb-2'>{error.message}</span>}
                <input className='mb-6 py-2 px-4 border-b-2 outline-none' type="text" placeholder='display name'/>
                <input className='mb-6 py-2 px-4 border-b-2 outline-none' type="text" placeholder='email'/>
                <input className='mb-6 py-2 px-4 border-b-2 outline-none' type="password" placeholder='password'/>
                <input className='hidden' type="file" id='file'/>
                <label className='mb-6 flex items-center gap-4 text-indigo-400 font-bold cursor-pointer' htmlFor="file"> <img className='h-12' src={AddAvatar} alt="Add Icon" /> Add an Avatar</label>
                <button className='bg-indigo-400 p-2 text-white font-bold'>Sign Up</button>
            </form>
            <p className='mt-2'>Already have an account? <Link className='underline' to='/login'>Login</Link></p>
        </div>
    </div>
  )
}

export default Register