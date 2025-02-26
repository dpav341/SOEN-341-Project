import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from "react-cookie";
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Select from './pages/Select/Select'

function App() {
  const [cookies] = useCookies();

  return (
    <div className="App">
      <CookiesProvider>
        {/* <Navbar /> */}
        <Routes>
          {/* <Route exact path="/" element={cookies.idCookie ? <UserDashboard />: <Navigate to="/login" replace />} /> */}
          <Route path="/select" element={<Select />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </CookiesProvider>
    </div>
  );
}

export default App;
