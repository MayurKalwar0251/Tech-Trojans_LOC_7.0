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

const googleMapsApiKey = "AIzaSyCVxscEAGCEkBt_hGpbZD2QuNfrRGfW3VA";

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

  // nearest police station details
  const [nearestPoliceStationName, setNearestPoliceStationName] = useState("");
  const [nearestPoliceStationLocation, setNearestPoliceStationLocation] =
    useState("");
  const [nearestPoliceStationLatitude, setNearestPoliceStationLatitude] =
    useState("");
  const [nearestPoliceStationLongitude, setNearestPoliceStationLongitude] =
    useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("available-police", (data) => {
      console.log("Available Police Officers:", data);
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

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: coordinates,
      radius: 5000,
      keyword: "police station",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("Nearby Police Stations:");
        results.forEach((station, index) => {
          console.log(
            `#${index + 1} Name: ${
              station.name
            }, Latitude: ${station.geometry.location.lat()}, Longitude: ${station.geometry.location.lng()}`
          );
        });

        setPoliceStations(results.slice(0, 5));
        findShortestRoute(coordinates, results);

        // then  will pass this detail in backend about the nearest location police station and current user latitude and longitude
      } else {
        console.error("Error finding police stations:", status);
      }
    });
  };

  const findShortestRoute = (origin, stations) => {
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
          console.log("Nearest Police Station:"); // Log nearest police station details
          console.log(
            `Name: ${
              nearestStation.name
            }, Latitude: ${nearestStation.geometry.location.lat()}, Longitude: ${nearestStation.geometry.location.lng()}`
          );

          if (!nearestStation) {
            console.log("Didnt found any nearest police location");
            return;
          }

          console.log("Emitting crime alert socket event...");

          // Emit to backend with nearest police station & user location
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

          setNearestPoliceStationName(nearestStation.name);
          setNearestPoliceStationLatitude(
            nearestStation.geometry.location.lat()
          );
          setNearestPoliceStationLongitude(
            nearestStation.geometry.location.lng()
          );
          setNearestPoliceStationLocation(nearestStation.vicinity);

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

                {policeStations.map((station, index) => (
                  <Marker
                    key={index}
                    position={station.geometry.location}
                    title={station.name}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new window.google.maps.Size(35, 35),
                    }}
                    onClick={() => {
                      setInfoWindowPos(station.geometry.location);
                      setInfoWindowVisible(true);
                    }}
                  />
                ))}

                {directions && (
                  <>
                    <DirectionsRenderer directions={directions} />
                    {infoWindowVisible && infoWindowPos && (
                      <InfoWindow
                        position={infoWindowPos}
                        onCloseClick={() => setInfoWindowVisible(false)}
                      >
                        <div>Estimated Time: {travelTime}</div>
                      </InfoWindow>
                    )}
                  </>
                )}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default UserCrimeLoc;
