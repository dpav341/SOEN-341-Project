import React, { useState } from "react";
import "./Login.css";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function onLogin() {
    try {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => alert("Login successful!"))
        .catch((error) => alert("Invalid credentials."));
    } catch (ex) {
      console.log(ex);
    }
  }

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => alert("Login successful!"))
      .catch((error) => alert("Invalid login attempt."));
  };

  return (
    <div className="login-wrapper">
      <div className="boxL">
        <h1>Sign In</h1>
        <label>
          <h4>Email:</h4>
          <input
            className="forms"
            type="text"
            name="email"
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </label>
        <label>
          <h4>Password:</h4>
          <input
            className="forms"
            type="password"
            name="password"
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </label>
        {error && <h5 className="login-error">{error}</h5>}
        <div>
          <button className="user_btn" type="submit" onClick={onLogin}>
            Login
          </button>
        </div>
        <button className="user_btn" type="button" onClick={signIn}>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
