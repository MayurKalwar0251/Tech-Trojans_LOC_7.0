import { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import { UserContext } from "./context/userContext";
import { getUserDetails } from "./context/User/user";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/SignUpPage";
import { Sidebar } from "./pages/Sidebar";
import PoliceDashboard from "./pages/PoliceDashboard";
import Crimes from "./pages/Crimes";
import PoliceLocator from "./pages/PoliceLocator";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import UserSignup from "./pages/SignUps/UserSignUp";
import UserHome from "./pages/SignUps/UserHome";
import CrimesAtLocation from "./pages/CrimesAtLocation";

function App() {
  const { setUser, user, setIsAuthen, setLoading, setError, setIsAgent } =
    useContext(UserContext);

  console.log("user", user);

  useEffect(() => {
    const checkCookiesAndDispatch = async () => {
      const userToken = document.cookie.includes("token");

      console.log("USER TOKEN: User Login Status:", userToken);

      if (userToken) {
        await getUserDetails(
          setIsAuthen,
          setUser,
          setLoading,
          setError,
          setIsAgent
        );
      } else {
        setLoading(false); // No token, stop loading
      }
    };
    checkCookiesAndDispatch();
  }, []);

  return (
    <div className="min-h-screen sticky bg-gray-50 flex">
      {user && <Sidebar className="" />}
      <div className="flex-1 space-y-6 p-6 ml-14">
        <Routes>
          <Route
            path="/"
            element={user ? <PoliceDashboard /> : <LoginPage />}
          />

          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/login" element={<LoginPage role="CITIZEN" />} />
          <Route path="/user/home" element={<UserHome />} />

          <Route path="/login" element={<LoginPage role="POLICEPEOPLE" />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/crimes" element={<Crimes />} />
          <Route path="/dashboard" element={<PoliceDashboard />} />
          <Route path="/chat" element={<HomePage />} />
          <Route path="/crime-loc" element={<HomePage />} />
          <Route path="/location" element={<PoliceLocator />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
