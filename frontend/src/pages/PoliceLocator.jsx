import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";

const googleMapsApiKey = "AIzaSyCVxscEAGCEkBt_hGpbZD2QuNfrRGfW3VA";

const mapContainerStyle = {
  width: "100%",
  height: "600px", // Made slightly taller for better visibility
};

const defaultCenter = { lat: 19.076, lng: 72.8777 };

const PoliceLocator = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState("");
  const [infoWindowPos, setInfoWindowPos] = useState(null);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);
  // const [selectedStation, setSelectedStation] = useState(null);

  // Keeping all the original functions unchanged
  const geocodeLocation = async () => {
    if (!location) return;

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${googleMapsApiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ lat, lng });
        findNearestPoliceStations(lat, lng);
      } else {
        console.error("Geocoding failed:", data.status);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const findNearestPoliceStations = (lat, lng) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: { lat, lng },
      radius: 5000,
      keyword: "police station",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPoliceStations(results.slice(0, 5));
        findShortestRoute({ lat, lng }, results);
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

          setTravelTime(response.rows[0].elements[shortestIndex].duration.text);
          findRoute(origin, stations[shortestIndex].geometry.location);
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
          {/* Header */}
          <div className="bg-purple-600 p-6 text-white">
            <h2 className="text-2xl font-bold text-center">
              Emergency Police Station Locator
            </h2>
            <p className="mt-2 text-center text-blue-100">
              Find the nearest police stations in your area with real-time
              directions
            </p>
          </div>

          {/* Search Bar */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex gap-4 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Enter location (e.g., Andheri)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onKeyPress={(e) => e.key === "Enter" && geocodeLocation()}
              />
              <button
                onClick={geocodeLocation}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="p-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={coordinates || defaultCenter}
                zoom={coordinates ? 15 : 10}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
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
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        polylineOptions: {
                          strokeColor: "#2563EB",
                          strokeWeight: 5,
                        },
                      }}
                    />
                    {infoWindowVisible && infoWindowPos && (
                      <InfoWindow
                        position={infoWindowPos}
                        onCloseClick={() => setInfoWindowVisible(false)}
                      >
                        <div className="p-2">
                          <strong>Estimated Time:</strong> {travelTime}
                        </div>
                      </InfoWindow>
                    )}
                  </>
                )}
              </GoogleMap>
            </div>
          </div>

          {/* Police Stations List */}
          {policeStations.length > 0 && (
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Nearest Police Stations
              </h3>
              <div className="grid gap-4">
                {policeStations.map((station, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-blue-600">
                      {station.name}
                    </h4>
                    <p className="text-gray-600 mt-1 text-sm">
                      {station.vicinity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </LoadScript>
  );
};

export default PoliceLocator;
