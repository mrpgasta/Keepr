import SignUp from './components/SignUp';
import './index.css'

import { Route, Routes } from "react-router-dom";
import Login from './components/Login';
import { useNavigate } from 'react-router-dom'
import { useEffect,useState } from 'react';
import Home from './components/Home';

import {onAuthStateChanged} from 'firebase/auth';
import { auth } from "./configs/firebaseConfig";




function App() {

  const [user, setUser] = useState({
    email: '',
    uid: ''
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if(!currentuser){
        navigate('/login')
      }
      if(currentuser){
        navigate('/home')
        console.log("logging in...")
        console.log(currentuser.uid)
        setUser({
          email: currentuser.email,
          uid: currentuser.uid
        })
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <div className="container mx-auto px-2 max-w-5xl pt-10 md:pt-32">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/home" element={<Home currentUser={user}/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
