import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from "react-cookie";
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';

function App() {
  const [cookies] = useCookies();

  return (
    <div className="App">
      <CookiesProvider>
        <Routes>
          {/* <Route path="/user-dashboard" element={<UserDashboard />}/>  */}
          <Route exact path="/" element={cookies.idCookie ? <SignUp /> : <Navigate to="/login" replace />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </CookiesProvider>
    </div>
  );
}

export default App;
