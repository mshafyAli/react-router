import './App.css';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


import Home from './Pages/Home/home'
import About from './Pages/About/about'
import Login from './Pages/Login/login'
import SignUp from './Pages/SignUp/signup'
import Chat from './Pages/Chat/chat'
import axios from 'axios';

const baseUrl = "http://localhost:3000";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const CheckLoginStatus = async () => {

      try {
        const response = await axios.get(`${baseUrl}/api/v1/ping`, {
          withCredentials: true,
        });
        setIsLoading(true)
      } catch (err) {
        setIsLoading(false)
        console.log(err);

      }

    }
    CheckLoginStatus();
  })


  return (
    <div>

      {isLoading ? (<nav>
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/chat"}>Chat</Link>
          </li>
        </ul>
      </nav>) : (<nav>
        <ul>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
          <li>
            <Link to={"/signup"}>SignUp</Link>
          </li>

        </ul>
      </nav>)  }

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="chat" element={<Chat />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path='*' element={<Navigate to='/' replace={true} />} />
      </Routes>

    </div>
  );
}

export default App;
