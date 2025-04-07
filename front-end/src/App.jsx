import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from "react-cookie";
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Select from './pages/Select/Select';
import ChatPage from './pages/ChatPage/ChatPage';
import Weather from './weather/weather';


function App() {

  return (
    <div className="App">
    <CookiesProvider>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/select" element={<Select />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </CookiesProvider>
  </div>
  )
}

export default App
