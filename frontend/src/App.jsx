import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import React from "react";
import "./App.css";

import { UserContext } from "./context/userContext";
import { getUserDetails } from "./context/User/user";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";

function App() {
  const { setUser, user, setIsAuthen, setLoading, setError, setIsAgent } =
    useContext(UserContext);
  useEffect(() => {
    const checkCookiesAndDispatch = () => {
      const userToken = document.cookie.includes("token");

      console.log("USERTOEKN User Login or not", userToken);

      if (userToken) {
        getUserDetails(setIsAuthen, setUser, setLoading, setError, setIsAgent);
      } else {
        setLoading(false); // No token, stop loading
      }
    };
    checkCookiesAndDispatch();
  }, []);

  return <>{user ? <HomePage /> : <LoginPage />}</>;
}

export default App;
