import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { loginErrorCheck } from '../utils/errorCheck';

const Login = () => {
  const [ error, setError ] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value;
    const password = e.target[1].value;
    if(email === '' && password === '') return setError({message: 'Please enter your credentials'})
    try {
        await signInWithEmailAndPassword(auth, email, password)
        navigate('/')
    } catch(err) {
      setError(loginErrorCheck(err.message.split(' ').pop()))
    }
  }
  return (
    <div className='h-screen bg-indigo-300 w-screen flex justify-center items-center p-4'>
        <div className='w-full mx-auto max-w-[450px] text-center bg-white p-6 rounded-lg'>
            <h1 className='text-2xl font-extrabold text-purple-900'>King's Chat</h1>
            <p className='my-2'>Login</p>
            <form action="" className='flex flex-col px-8' onSubmit={handleSubmit}>
              {error && <span className='text-red-600 mb-2'>{error.message}</span>}
                <input className='mb-6 py-2 px-4 border-b-2 outline-none' type="text" placeholder='email'/>
                <input className='mb-6 py-2 px-4 border-b-2 outline-none' type="password" placeholder='password'/>
                <button className='bg-indigo-400 p-2 text-white font-bold mb-6'>Sign In</button>
            </form>
            <p>You don't have an account? <Link className='underline' to='/register'>Register</Link></p>
        </div>
    </div>
  )
}

export default Login