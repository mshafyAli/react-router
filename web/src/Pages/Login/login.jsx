import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import axios from 'axios';
import './login.css'


const baseUrl = "http://localhost:3000";


const Login = () => {

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  
  const [passwordVisible, setPasswordVisible] = useState(false);


  useEffect(() => {
    setTimeout(() =>{
      setAlertMessage("");
      setErrorMessage("");
    
    },5000)


  },[alertMessage, errorMessage])


  const LoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup handler");

    try {

      const response = await axios.post(`${baseUrl}/api/v1/login`, {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      },{
        withCredentials: true,
      });
      console.log(response?.data?.message);
      setAlertMessage(response?.data?.message);
    } catch (err) {
      console.log(err.response?.data?.message);
      setAlertMessage(err.response?.data?.message);

    }


  }



  return (
    <>

      <h1 className='text-4xl font-bold text-center'>Sign Up</h1>

      <form onSubmit={LoginSubmit}>


        <div>
          <input className='rounded-md border-2 border-black px-2 py-1 ' type="text" placeholder='Email' name="email" ref={emailRef} id="email" autoComplete='email' />
        </div>

        <div className='flex'>
          <input className='rounded-md border-2 border-black px-2 py-1 ' ref={passwordRef} id="password" placeholder='Password' autoComplete='new-password' type={passwordVisible ? "text" : "password"} />
          <div onClick={() => setPasswordVisible(!passwordVisible)} className='p-2 cursor-pointer'>

            {passwordVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>


        </div>

        <button className='bg-blue-500 text-white p-2 rounded-md my-2  hover:text-black' type="submit">Login</button>

        <div className='alertMessage'>{alertMessage}</div>
        <div className='errorMessage'>{errorMessage}</div>



      </form >


    </>
  )
}

export default Login