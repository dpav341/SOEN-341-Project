import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { handleCookies } from "../../utils/helpers";
import "./SignUp.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  async function onSignUp() {
    try {

      // create user in firebase authentication
      const auth = getAuth();
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);

      navigate("/login");
    } catch (ex) {
      console.log(ex);
      switch (ex.code) {
        case 'auth/email-already-in-use':
          setError("The email address is already in use by another account.");
          break;
        case 'auth/invalid-email':
          setError("The email address is not valid.");
          break;
        case 'auth/operation-not-allowed':
          setError("Email/password accounts are not enabled.");
          break;
        case 'auth/weak-password':
          setError("The password is too weak.");
          break;
        default:
          setError("Whoops! Something went wrong.");
          break;
      }
    }
  }

  return (
    <div className="signup_wrapper">
      <div className="boxS">
        <h1>Sign Up</h1>
        <label>
          <h4>Username:</h4>
          <input
            className="forms"
            type="text"
            name="name"
            onChange={(ev) => setName(ev.target.value)}
          />
        </label>
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
        <div>
          <button className="user_btn" type="submit" onClick={onSignUp}>
            Register
          </button>
        </div>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}
