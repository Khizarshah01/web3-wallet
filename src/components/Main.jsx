import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "../pages/CreateWallet";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SetPassword from "../pages/SetPassword";
import PrivateRoute from "./PrivateRoutes";
import Auth from "../pages/Auth";
import Layout from "./Layout";
import TokenDetails from "../pages/TokenDetails"

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/verify-password" element={<Auth />} />

        {/* Protected Routes with Sidebar */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/token/:id"
            element={
              <PrivateRoute>
                <TokenDetails />
              </PrivateRoute>
            }
          />
          {/* Add more Sidebar-wrapped pages here if needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Main;
