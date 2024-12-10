import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventResults from '../components/EventResults';

const EventPage = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [numParticipants, setNumParticipants] = useState(1);

  useEffect(() => {
    // Fetch event details using the eventId
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/event/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEventDetails(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleNumParticipantsChange = (e) => {
    setNumParticipants(parseInt(e.target.value, 10));
  };

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="body">
      <div className="body-container">
        <h1 className="body-title-text">{eventDetails.eventTitle}</h1>
        <p className="body-inner-text">Address: {eventDetails.eventAddress}</p>
        <p className="body-inner-text">Description: {eventDetails.eventDescription}</p>
        <p className="body-inner-text">Organizer: {eventDetails.creator.name}</p>
        <p className="body-inner-text">Organizer Email: {eventDetails.creator.email}</p>

        <div>
          <label htmlFor="numParticipants" className="body-inner-text">
            Number of Participants:
            <input
              type="number"
              id="numParticipants"
              value={numParticipants}
              onChange={handleNumParticipantsChange}
              min="1"
            />
          </label>
        </div>

        <EventResults 
          numPeople={numParticipants} 
          eventAddress={eventDetails.eventAddress}
        />
      </div>
    </div>
  );
};

export default EventPage;