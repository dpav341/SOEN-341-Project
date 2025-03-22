import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from "react-cookie";
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Select from './pages/Select/Select'
import ChatContainer from "./components/ChatContainer"
import ChatPage from './pages/ChatPage/ChatPage';


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
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </CookiesProvider>
  </div>
  )
}

export default App
