import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zZXBoLWFiZGVsbWFsZWsiLCJhIjoiY20wc2c3bGx4MG9mcTJscTB4N3ExbnF5OSJ9.9Zz0gVSm8-OO7mzKbhOhhw';

const EventResults = ({ eventId }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70);
  const [lat, setLat] = useState(40);
  const [zoom, setZoom] = useState(3);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://5.78.125.190:5000/event/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event data');
        const data = await response.json();
        setEventDetails(data);

        if (data.eventAddress) {
          const eventCoords = await getCoordinates(data.eventAddress);
          if (eventCoords) {
            setLng(eventCoords[0]);
            setLat(eventCoords[1]);
            setZoom(10);
          }
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current || !eventDetails) return;

    const markers = document.getElementsByClassName('marker');
    while (markers[0]) {
      markers[0].parentNode.removeChild(markers[0]);
    }

    if (eventDetails.eventAddress) {
      addMarker(eventDetails.eventAddress, 'event');
    }

    eventDetails.participants.forEach(participant => {
      addMarker(participant.address, 'participant', participant);
    });
  }, [eventDetails]);

  const addMarker = async (address, type, participantData = null) => {
    const coords = await getCoordinates(address);
    if (!coords) return;

    const el = document.createElement('div');
    el.className = `marker ${type}`;

    if (type === 'participant') {
      if (participantData.hasCar && participantData.canGiveRides) {
        el.classList.add('can-give-rides');
      } else {
        el.classList.add('cannot-give-rides');
      }
    }

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coords)
      .addTo(map.current);

    if (type === 'participant') {
      marker.getElement().addEventListener('click', () => {
        setSelectedParticipant(prev => prev === participantData ? null : participantData);
        console.log("Everything", selectedParticipant)
      });
    }
  };

  const getCoordinates = async (address) => {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`);
      if (!response.ok) throw new Error('Geocoding failed');
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].center;
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
    return null;
  };

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
};

return (
    <div className="event-results">
      <div className="map-sidebar-container">
        <div className="map-container" ref={mapContainer} />
        {selectedParticipant && (
        <div className="sidebar">
          <h3>{selectedParticipant.name}</h3>
          <p>Email: {selectedParticipant.phone}</p>
          <p>Address: {selectedParticipant.address}</p>
          <p>Has Car: {selectedParticipant.hasCar ? 'Yes' : 'No'}</p>
          {selectedParticipant.hasCar && (
            <>
              <p>Can Give Rides: {selectedParticipant.canGiveRides ? 'Yes' : 'No'}</p>
              {selectedParticipant.canGiveRides && (
                <p>Max Passengers: {selectedParticipant.maxPassengers}</p>
              )}
            </>
          )}
          <button 
            className="email-button" 
            onClick={() => handleEmailClick(selectedParticipant.email)}
          >
            Call
          </button>
        </div>
      )}
      </div>
    </div>
);
};

export default EventResults;