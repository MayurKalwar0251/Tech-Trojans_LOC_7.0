import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import SocketContext from "../context/SocketContext";
import CrimesAtLocation from "./CrimesAtLocation";

const HomePage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [inspectorLocation, setInspectorLocation] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false); // Track location fetch status

  // Function to get location with error handling
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setInspectorLocation(location);
          setLocationFetched(true); // Mark location as fetched
        },
        (error) => {
          console.error("Error fetching location:", error);
          setInspectorLocation({ lat: 19.076, lng: 72.8777 }); // Default to Mumbai
          setLocationFetched(true); // Mark location as fetched
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported.");
      setInspectorLocation({ lat: 19.076, lng: 72.8777 }); // Default to Mumbai
      setLocationFetched(true);
    }
  };

  // Fetch location first
  useEffect(() => {
    fetchLocation();
  }, []);

  // Establish socket connection only after location is fetched
  useEffect(() => {
    if (!locationFetched || !user) return;

    const newSocket = io("http://localhost:3000");

    setSocket(newSocket);

    // Register user with socket after location is available
    newSocket.emit("register_user_based_on_role", {
      role: user.role,
      userId: user._id,
      latitude: inspectorLocation.lat,
      longitude: inspectorLocation.lng,
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, locationFetched]);

  return (
    <SocketContext.Provider value={socket}>
      {locationFetched ? <CrimesAtLocation /> : <p>Fetching location...</p>}
    </SocketContext.Provider>
  );
};

export default HomePage;
