import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { handleCookies } from '../../utils/helpers';
import './Login.css';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [, setCookie] = useCookies(['emailCookie']);
  const navigate = useNavigate();

  async function onLogin() {
    try {
      const { data } = await axios.post(`'https://jsonplaceholder.typicode.com/posts'`, { email, password });

      if (data) {
        const cookies = [
          {
            name: "idCookie",
            value: data.id,
          },
          {
            name: "emailCookie",
            value: data.email,
          }
        ]
        handleCookies(cookies, setCookie);
        navigate('/');
      }

    } catch (ex) {
      console.log(ex);
      setError(ex.response.data.error || 'Password or Email wrong');
    }
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
      </div>
    </div>
  );
};
