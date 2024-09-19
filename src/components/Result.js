import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import mapboxgl from "mapbox-gl";

// Your Mapbox access token (to be added by you)
mapboxgl.accessToken = "pk.eyJ1Ijoiam9zZXBoLWFiZGVsbWFsZWsiLCJhIjoiY20wc2c3bGx4MG9mcTJscTB4N3ExbnF5OSJ9.9Zz0gVSm8-OO7mzKbhOhhw";

function Result() {
  const { state } = useLocation();
  const { formData } = state || {};
  const [route, setRoute] = useState(null);
  const mapContainer = useRef(null);

  // State for meeting location (defaults to New York coordinates if not provided)
  const [meetingLocation, setMeetingLocation] = useState("-73.935242,40.730610");

  useEffect(() => {
    if (formData.meetingLocation) {
      setMeetingLocation(encodeURIComponent(formData.meetingLocation));
    }
  }, [formData]);

  const fetchRoute = useCallback(async () => {
    const people = formData.people;
    const carOwners = people.filter(person => person.carOwner);
    const nonCarOwners = people.filter(person => !person.carOwner && person.canGiveRides === false);

    // For now, we will just calculate routes for car owners and meeting location
    const waypoints = carOwners.map(person => encodeURIComponent(person.address)).join(';');
    const directionsURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints};${meetingLocation}?access_token=${mapboxgl.accessToken}`;

    try {
      const response = await axios.get(directionsURL);
      const routeData = response.data.routes[0];
      setRoute(routeData);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  }, [formData, meetingLocation]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.935242, 40.730610], // Default center (New York)
      zoom: 10,
    });

    if (formData) {
      fetchRoute().then(() => {
        if (route) {
          const routeCoordinates = route.geometry.coordinates;

          map.on("load", () => {
            // Add route to map
            map.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: routeCoordinates,
                },
              },
            });

            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#3887be",
                "line-width": 5,
              },
            });

            // Adjust map bounds to fit route
            const bounds = routeCoordinates.reduce((bounds, coord) => {
              return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(routeCoordinates[0], routeCoordinates[0]));

            map.fitBounds(bounds, { padding: 50 });
          });
        }
      });
    }

    return () => map.remove(); // Clean up map on unmount
  }, [formData, route, fetchRoute]);

  return (
    <div>
      <h1>Optimized Route</h1>
      {route ? (
        <div>
          <p>Estimated travel time: {Math.round(route.duration / 60)} minutes</p>
          <p>Distance: {Math.round(route.distance / 1000)} km</p>
          <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />
        </div>
      ) : (
        <p>Loading route...</p>
      )}
    </div>
  );
}

export default Result;
