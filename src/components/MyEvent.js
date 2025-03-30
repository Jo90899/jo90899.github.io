// MyEvent.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventResults from './EventResults';
import JoinEvent from './JoinEvent';
import { Button } from './Button';
import './Event.css'; 
import '../App.css'; 

const MyEvent = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`https://gather-maps.com:5050/event/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event details');
        const data = await response.json();
        setEventDetails(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details. Please try again.');
      }
    };
    fetchEventDetails();
  }, [eventId]);

  if (error) return <div className="error">{error}</div>;
  if (!eventDetails) return <div>Loading...</div>;

  return (
    <>
        <div className="event-results">
        <h1 className='body-title-text'>{eventDetails.eventTitle}</h1>
        <p className='body-inner-text'>{eventDetails.eventDescription}</p>
        <Button 
          className='btns' 
          buttonStyle='btn--primary' 
          buttonSize='btn--large'
          scrollTo="joinEventSection"
        >
          Join the Event!
        </Button>
        </div>
        <EventResults eventId={eventId} />
        <div id="joinEventSection">
          <JoinEvent eventId={eventId} onJoinSuccess={() => {}} />
        </div>
    </>
  );
};

export default MyEvent;