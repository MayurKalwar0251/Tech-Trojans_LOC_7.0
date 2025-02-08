import React, { useContext } from "react";
import { UserContext } from "../context/userContext";

const HomePage = () => {
  const { setUser, user, setIsAuthen, setLoading, setError, setIsAgent } =
    useContext(UserContext);
  return <div>{user.name}</div>;
};

export default HomePage;
