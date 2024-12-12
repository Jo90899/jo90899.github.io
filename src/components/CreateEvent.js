import React, { useState } from 'react';
import './Event.css';
import AddressAutocomplete from './AddressAutocomplete';
import { Button } from './Button';

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    eventTitle: '',
    eventAddress: '',
    eventDescription: '',
    mainUserName: '',
    mainUserPhone: '',
    mainUserAddress: ''
  });

  const [participateInEvent, setParticipateInEvent] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    address: '',
    hasCar: false,
    canGiveRides: false,
    maxPassengers: 0
  });

  const [eventLink, setEventLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAddressChange = (name, value) => {
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleUserInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUserAddressChange = (name, value) => {
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://gather-maps.com/components/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      const result = await response.json();
      const eventId = result.eventId;
      
      // If main user is participating, join the event
      if (participateInEvent) {
        const joinResponse = await fetch(`https://gather-maps.com/join-event/${eventId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        if (!joinResponse.ok) {
          throw new Error('Failed to join event');
        }
      }

      setEventLink(`${window.location.origin}/my-event/${result.eventId}`);
    } catch (error) {
      console.error('Error creating event:', error);
      setErrorMessage('There was a problem creating the event. Please try again.');
    }
  };

  return (
    <div className="create-event-body">
      <div className="create-event-container">
        <h2 className="create-event-title">Create a New Event</h2>
        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-group">
            <label htmlFor="eventTitle">Event Title:</label>
            <input
              type="text"
              id="eventTitle"
              name="eventTitle"
              value={eventData.eventTitle}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventAddress">Event Address:</label>
            <AddressAutocomplete
              value={eventData.eventAddress}
              onChange={(value) => handleAddressChange('eventAddress', value)}
              placeholder="Enter event address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventDescription">Event Description: (optional)</label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              value={eventData.eventDescription}
              onChange={handleInputChange}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={participateInEvent}
                onChange={(e) => setParticipateInEvent(e.target.checked)}
              />
              I want to participate in this event
            </label>
          </div>

          {participateInEvent && (
            <>
              <h2 className="create-event-subtitle">Your Participation Details</h2>
              <div className='form-group'>
                <label htmlFor="name">Name:</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={userData.name} 
                  onChange={handleUserInputChange} 
                  required 
                  className='form-input'
                />
              </div>
              <div className='form-group'>
                <label htmlFor="phone">Phone:</label>
                <input 
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userData.phone} 
                  onChange={handleUserInputChange} 
                  required 
                  className='form-input'
                />
              </div>
              <div className='form-group'>
                <label htmlFor="address">Address:</label>
                <AddressAutocomplete
                  value={userData.address}
                  onChange={(value) => handleUserAddressChange('address', value)}
                  placeholder="Enter your address"
                  label="Your Address:"
                />
              </div>
              <div className='form-group'>
                <label>
                  <input type="checkbox" name="hasCar" checked={userData.hasCar} onChange={handleUserInputChange} />
                  Do you have a car?
                </label>
              </div>
              {userData.hasCar && (
                <>
                  <div className='form-group'>
                    <label>
                      <input type="checkbox" name="canGiveRides" checked={userData.canGiveRides} onChange={handleUserInputChange} />
                      Can you give rides?
                    </label>
                  </div>
                  {userData.canGiveRides && (
                    <div className='form-group'>
                      <label htmlFor="maxPassengers">Max passengers:</label>
                      <input 
                        type="number" 
                        id="maxPassengers" 
                        name="maxPassengers" 
                        value={userData.maxPassengers} 
                        onChange={handleUserInputChange} 
                        min="1" 
                        className='form-input'
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
          <Button>Create Event</Button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {eventLink && (
          <>
          <div className="event-link-container">
            <p>Event created successfully! Share this link with participants:</p>
          </div>
          <div className="event-link-container">
            <a href={eventLink} className="event-link" target="_blank" rel="noopener noreferrer">
              {eventLink}
            </a>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;