import { useEffect, useRef, useState } from 'react'
import "./signup.css"
import axios from 'axios';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const baseUrl = "http://localhost:3000";



const Signup = () => {

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);


  const [passwordErrorClass, setPasswordErrorClass] = useState("hidden");
  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAlertMessage("");
      setErrorMessage("");



    }, 5000);
  }, [alertMessage, errorMessage]);



  const SignUpSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup handler");


    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setPasswordErrorClass("");
      return;
    } else {
      setPasswordErrorClass("hidden");
    }

    try {

      const response = await axios.post(`${baseUrl}/api/v1/signup`, {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      console.log(response.data.message);
      setAlertMessage(response.data.message);
    } catch (err) {
      console.log(err.response.data.message);
      setAlertMessage(err.response.data.message);

    }


  }




  return (
    <>

      <h1 className='text-4xl font-bold text-center'>Sign Up</h1>

      <form onSubmit={SignUpSubmit}>

        <div>
          <input className='rounded-md border-2 border-black px-2 py-1 ' type="text" placeholder='First Name' ref={firstNameRef} id="firstName" autoComplete='given-name' />
        </div>
        <div>
          <input className='rounded-md border-2 border-black px-2 py-1 ' type="text" placeholder='last Name' ref={lastNameRef} id="firstName" autoComplete='family-name' />
        </div>

        <div>
          <input className='rounded-md border-2 border-black px-2 py-1 ' type="text" placeholder='Email' name="email" ref={emailRef} id="email" autoComplete='email' />
        </div>

        <div className='flex'>
          <input className='rounded-md border-2 border-black px-2 py-1 ' ref={passwordRef} id="password" placeholder='Password' autoComplete='new-password' type={passwordVisible ? "text" : "password"} />
          <div onClick={() => setPasswordVisible(!passwordVisible)} className='p-2 cursor-pointer'>

            {passwordVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>


        </div>

        <div className='flex'>
          <input className='rounded-md border-2 border-black px-2 py-1 '  ref={confirmPasswordRef} placeholder='Confirm Password' id="confirmPassword" autoComplete='current-password' type={confirmPasswordVisible ? "text" : "password"} />
          <div onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className='p-2 cursor-pointer'>

            {confirmPasswordVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>

        </div>




        <p className={`errorMessage ${passwordErrorClass}`}>Password do not match</p>

        <button className='bg-blue-500 text-white p-2 rounded-md my-2  hover:text-black' type="submit">Sign up</button>


        <div className='alertMessage'>{alertMessage}</div>
        <div className='errorMessage'>{errorMessage}</div>



      </form >


    </>
  )
}

export default Signup