import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import SocketContext from "../../context/SocketContext"; // Import SocketContext
import UserCrimeLoc from "./UserCrimeLoc";

const UserHome = () => {
  const { setUser, user, setIsAuthen, setLoading, setError } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null); // State to hold the socket instance

  const [inspectorLocation, setInspectorLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setInspectorLocation(location);
        },
        (error) => {
          console.error("Error fetching inspector's location:", error);
        }
      );
    }
  }, []);
  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    if (user) {
      newSocket.emit("register_user_based_on_role", {
        role: user.role,
        userId: user._id,
        latitude: inspectorLocation?.lat,
        longitude: inspectorLocation?.lng,
      });
    }

    return () => {
      newSocket.disconnect();
    };
  }, [user, inspectorLocation]);

  console.log("socket", socket);

  return (
    <SocketContext.Provider value={socket}>
      <UserCrimeLoc />
    </SocketContext.Provider>
  );
};

export default UserHome;
