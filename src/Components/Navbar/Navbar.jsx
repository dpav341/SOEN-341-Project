// import React from "react";
// import { useCookies } from 'react-cookie';
// import { Link } from 'react-router-dom';
// import "./Navbar.css";
// // import "../../CommonStyles.scss";

// export default function Navbar() {
//   const [cookies] = useCookies();

//   const isLoggedIn = cookies.idCookie;

//   console.log(cookies.emailCookie);

//   return(
  
//     <main>
//       <div className="nav-div">
//         <div className="logo-container">
//         <Link className="NavMage" to="/" title="Phone home"><img src={require('../../docs/logo.png')} alt="" width = "50" height = "auto"/></Link>
//         <h1>Everyone's a Critic</h1>
//         </div>
//         <div className="user">
//           {isLoggedIn ? (
//             <>
//           <h4 className="welcome-back">Welcome back {cookies.emailCookie}!</h4>
//           <button className="Navbut"><Link className="NavLink" to="/playlists" title="Playlists">Playlists</Link></button>
//           <button className="Navbut"><Link className="NavLink" to="/user-dashboard" title="Dashboard">Dashboard</Link></button>
//           <button className="Navbut"><Link className="NavLink" to="/logout" title="Logout User">Logout</Link></button>
//           </>
//           ):(
//             <>
//             <button className="Navbut"><Link className="NavLink" to="/playlists" title="Playlists">Playlists</Link></button>
//             <button className="Navbut"><Link className="NavLink" to="/login" title="Login User">Login</Link></button>
//             <button className="Navbut"><Link className="NavLink" to="/sign-up" title="Register for an Account">Register</Link></button>
//             </>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }