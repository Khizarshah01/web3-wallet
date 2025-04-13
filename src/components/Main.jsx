import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./pages/Create";
import Auth from './pages/Auth'
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
const Main = () => {
  return (
    <div className='flex h-screen bg-blue-400 justify-center items-center'>
      <div className='w-[500px] h-[700px] bg-white rounded-2xl shadow-lg p-6 text-center'>
      <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/create" element={<Create />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
      
      </div>
    </div>
  )
}

export default Main
