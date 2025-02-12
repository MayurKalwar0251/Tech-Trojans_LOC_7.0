import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const googleMapsApiKey = "AIzaSyDYPSMpXi6u8plNM8mMTK2H0KItU_b9Res";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const CrimesAtLocation = () => {
  const socket = useSocket();
  const [inspectorLocation, setInspectorLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Calculate route whenever locations or Google Maps availability changes
  useEffect(() => {
    if (inspectorLocation && clientLocation && googleLoaded) {
      calculateRoute(inspectorLocation, clientLocation);
    }
  }, [inspectorLocation, clientLocation, googleLoaded]);

  // Fetch inspector's real location if needed
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

  // Listen for client's crime alert location
  useEffect(() => {
    if (!socket) return;

    socket.on("crime-alert", ({ userLocation }) => {
      console.log("Crime Alert Received:", userLocation);
      setClientLocation(userLocation);
    });

    return () => {
      socket.off("crime-alert");
    };
  }, [socket]);

  // Calculate route from inspector to client
  const calculateRoute = (origin, destination) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded yet");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`, {
            origin,
            destination,
          });
        }
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-red-600 text-center">
        🚨 Live Crime Alerts
      </h2>

      <div className="mt-4">
        <LoadScript
          googleMapsApiKey={googleMapsApiKey}
          onLoad={() => setGoogleLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={inspectorLocation}
            zoom={14}
          >
            {/* Inspector's Marker */}
            <Marker
              position={inspectorLocation}
              label="Inspector"
              title="Inspector's Location"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />

            {/* Client's Crime Location Marker */}
            <Marker
              position={clientLocation}
              label="Client"
              title="Crime Location"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />

            {/* Route between inspector and client */}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default CrimesAtLocation;
