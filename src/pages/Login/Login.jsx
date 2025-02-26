import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { handleCookies } from '../../utils/helpers';
import './Login.css';
import { auth, provider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [, setCookie] = useCookies(['emailCookie']);
  const navigate = useNavigate();

  async function onLogin() {
    try {
      // const { data } = await axios.post(`'https://jsonplaceholder.typicode.com/posts'`, { email, password });

      // if (data) {

        //sign in with email/password using firebase authentication
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then(result => alert("Login successful!"))
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });

        // const cookies = [
        //   {
        //     name: "idCookie",
        //     value: data.id,
        //   },
        //   {
        //     name: "emailCookie",
        //     value: data.email,
        //   }
        // ]
        // handleCookies(cookies, setCookie);
        // navigate('/');
      // }

    } catch (ex) {
      console.log(ex);
      setError(ex.response.data.error || 'Password or Email wrong');
    }
  }


  const signIn = () => {
    signInWithPopup(auth, provider)
      .then(result => console.log(result))
      .catch(error => alert(error.message))
  }


  return (
    <div className="login-wrapper">
      <div className='boxL'>
        <h1>Sign In</h1>
        <label>
          <h4>Email:</h4>
          <input className='forms' type="text" name="email" onChange={(ev) => setEmail(ev.target.value)} />
        </label>
        <label>
          <h4>Password:</h4>
          <input className='forms' type="password" name="password" onChange={(ev) => setPassword(ev.target.value)} />
        </label>
        {error && <h5 className="login-error">{error}</h5>}
        <div>
          <button className="user_btn" type="submit" onClick={onLogin}>Login</button>
        </div>
        <button className="user_btn" type="button" onClick={signIn}>Sign In with Google</button>
      </div>
    </div>
  );
};
