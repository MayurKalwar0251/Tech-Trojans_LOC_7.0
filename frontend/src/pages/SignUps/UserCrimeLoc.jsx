import React, { useContext, useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import { useSocket } from "../../context/SocketContext";
import { UserContext } from "../../context/userContext";

const googleMapsApiKey = "AIzaSyDYPSMpXi6u8plNM8mMTK2H0KItU_b9Res";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = { lat: 19.076, lng: 72.8777 };

const UserCrimeLoc = () => {
  const { user } = useContext(UserContext);
  const socket = useSocket();

  const [coordinates, setCoordinates] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState("");
  const [infoWindowPos, setInfoWindowPos] = useState(null);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);

  // ✅ Store police officers' locations
  const [policeOfficers, setPoliceOfficers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("available-police", (data) => {
      console.log("🚔 Received available-police data:", data);

      if (data && data.policeMembers && data.policeMembers.length > 0) {
        const mappedPolice = data.policeMembers.map((officer) => ({
          lat: officer.location.latitude,
          lng: officer.location.longitude,
        }));
        setPoliceOfficers(mappedPolice);
      } else {
        console.warn("⚠ No police officers found in received data!");
      }
    });

    return () => {
      socket.off("available-police");
    };
  }, [socket]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const reportCrime = () => {
    if (!coordinates) return;
    console.log("we are here");

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: coordinates,
      radius: 5000,
      keyword: "police station",
    };

    // Location ko print karake save karwana

    // service.nearbySearch(request, (results, status) => {
    //   if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //     console.log("Nearby Police Stations:");

    //     const formattedResults = results.map((station) => ({
    //       name: station.name,
    //       location: station.vicinity,
    //       latitude: station.geometry.location.lat(),
    //       longitude: station.geometry.location.lng(),
    //       contactNumber: "9930948453",
    //       email: "mayur@gmail.com",
    //       password: "123456",
    //     }));

    //     console.log(JSON.stringify(formattedResults, null, 2));

    //     setPoliceStations(formattedResults);
    //     findShortestRoute(coordinates, results);
    //   } else {
    //     console.error("Error finding police stations:", status);
    //   }
    // });

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("Nearby Police Stations:", results);
        setPoliceStations(results.slice(0, 5));
        findShortestRoute(coordinates, results);
      } else {
        console.error("Error finding police stations:", status);
      }
    });
    console.log("we are here2");
  };

  const findShortestRoute = (origin, stations) => {
    console.log("3");

    const distanceService = new window.google.maps.DistanceMatrixService();
    const destinations = stations.map((station) => station.geometry.location);

    distanceService.getDistanceMatrix(
      {
        origins: [origin],
        destinations: destinations,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === window.google.maps.DistanceMatrixStatus.OK) {
          let shortestIndex = 0;
          let shortestTime = response.rows[0].elements[0].duration.value;

          response.rows[0].elements.forEach((element, index) => {
            if (element.duration.value < shortestTime) {
              shortestTime = element.duration.value;
              shortestIndex = index;
            }
          });

          const nearestStation = stations[shortestIndex];

          if (!nearestStation) {
            console.log("No nearest police location found.");
            return;
          }

          console.log(
            `Emitting crime alert socket event...,
            ${nearestStation.name},
            ${nearestStation.vicinity},
            ${nearestStation.geometry.location.lat()},
            ${nearestStation.geometry.location.lng()}`
          );

          socket.emit("crime-alert", {
            userLocation: coordinates,
            nearestPoliceStationDetails: {
              name: nearestStation.name,
              latitude: nearestStation.geometry.location.lat(),
              longitude: nearestStation.geometry.location.lng(),
              location: nearestStation.vicinity,
            },
            citizenId: user._id,
          });

          setTravelTime(response.rows[0].elements[shortestIndex].duration.text);
          findRoute(origin, nearestStation.geometry.location);
        }
      }
    );
  };

  const findRoute = (origin, destination) => {
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
          setInfoWindowPos(destination);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-purple-600 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">
              Emergency Police Station Locator
            </h2>
          </div>

          <div className="p-6 flex gap-4 justify-center">
            <button
              onClick={getUserLocation}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Allow Location Access
            </button>
            <button
              onClick={reportCrime}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Report Crime
            </button>
          </div>

          {coordinates && (
            <div className="text-center text-gray-800 font-medium">
              Your Location: Lat {coordinates.lat}, Lng {coordinates.lng}
            </div>
          )}

          <div className="p-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={coordinates || defaultCenter}
                zoom={coordinates ? 15 : 10}
                options={{ streetViewControl: false, mapTypeControl: false }}
              >
                {/* 🔵 Your Location */}
                {coordinates && (
                  <Marker
                    position={coordinates}
                    title="Your Location"
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                  />
                )}

                {/* 🔴 Police Stations */}
                {policeStations.map((station, index) => (
                  <Marker
                    key={index}
                    position={station.geometry.location}
                    title={station.name}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new window.google.maps.Size(35, 35),
                    }}
                  />
                ))}

                {/* 🟢 Police Officers */}
                {policeOfficers.map((officer, index) => (
                  <Marker
                    key={index}
                    position={officer}
                    title="Police Officer"
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                  />
                ))}

                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default UserCrimeLoc;
