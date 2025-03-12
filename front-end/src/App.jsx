import React from 'react';
import { Route, Navigate, Routes } from 'react-router';
import { CookiesProvider, useCookies } from "react-cookie";
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Select from './pages/Select/Select'
import ChatContainer from "./components/ChatContainer"


function App() {

  return (
    <div className="App">
    <CookiesProvider>
      {/* <Navbar /> */}
      <Routes>
        <Route exact path="/" element={<ChatContainer />} />
        <Route path="/select" element={<Select />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </CookiesProvider>
  </div>
  )
}

export default App
