import { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import "./App.css";

import { UserContext } from "./context/userContext";
import { getUserDetails } from "./context/User/user";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Register from "./pages/SignUpPage";

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
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
