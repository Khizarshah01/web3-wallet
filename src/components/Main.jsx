import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./pages/CreateWallet";
import Landing from './pages/Landing'
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SetPassword from "./pages/SetPassword";
import PrivateRoute from "./PrivateRoutes";
import Auth from "./pages/Auth";
const Main = () => {
  return (
    <div className='flex h-screen bg-blue-400 justify-center items-center '>
      <div className='w-[500px] h-[700px] bg-white rounded-2xl shadow-lg p-6 text-center overflow-y-auto scrollbar-hide'>
      <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<Create />} />
      <Route path="/login" element={<Login />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      <Route path="/verify-password" element={<Auth />} />
    </Routes>
  </BrowserRouter>
      
      </div>
    </div>
  )
}

export default Main
