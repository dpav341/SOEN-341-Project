import React, { useState } from "react";
import axios from "axios";
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
      // const { data } = await axios.post(
      //   "https://jsonplaceholder.typicode.com/posts",
      //   {
      //     name,
      //     email,
      //     password,
      //   }
      // );

      // create user in firebase authentication
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password);

      // if (data) {
      //   setCookie("idCookie", data.name, { path: "/" });
      //   setCookie("emailCookie", data.email, { path: "/" });
      //   setCookie("nameCookie", data.name, { path: "/" });

        navigate("/login");
      // }
    } catch (ex) {
      setError(ex.response.data.error || "Whoops! Something went wrong ");
    }
  }

  return (
    <div className="signup_wrapper">
      {error && <h1>{error}</h1>}
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
      </div>
    </div>
  );
}
