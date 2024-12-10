import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressAutocomplete from './AddressAutocomplete';
import './Event.css'; 
import { Button } from './Button'

const JoinEvent = ({ eventId, onJoinSuccess }) => {
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    hasCar: false,
    canGiveRides: false,
    maxPassengers: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://5.78.125.190:5000/event/${eventId}`);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressChange = (name, value) => {
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://5.78.125.190:5000/join-event/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join/update event');
      }
      const result = await response.json();
      if (result.success) {
        if (result.updated) {
          alert('Your information has been updated for this event.');
        } else {
          alert('You have successfully joined the event.');
        }
        navigate(`/my-event/${eventId}`);
      }
    } catch (error) {
      console.error('Error joining/updating event:', error);
      setError(`Failed to join/update the event: ${error.message}`);
    }
    console.log("Everything", userData)
  };

  if (!eventDetails) return <div className="create-event-body">Loading event details...</div>;
  if (error) return <div className="create-event-body">{error}</div>;

  return (
    <div className='create-event-body'>
      <div className='create-event-container'>
        <h1 className='create-event-title'>Join Event: {eventDetails.eventTitle}</h1>
        <div className='form-group'>
          <label><u>Event Address:</u></label>
          <li className='body-inner-text'>{eventDetails.eventAddress}</li>
        </div>
        <form onSubmit={handleSubmit} className='create-event-form'>
          <h2 className='create-event-subtitle'>Your Information</h2>
          <div className='form-group'>
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={userData.name} 
              onChange={handleInputChange} 
              required 
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="email">Email:</label>
            <input 
                type="email"
                id="email"
                name="email"
                value={userData.email} 
                onChange={handleInputChange} 
                required 
                className='form-input'
                placeholder="Enter your email"
              />
          </div>
          <div className='form-group'>
            <label htmlFor="address">Address:</label>
            <AddressAutocomplete
              value={userData.address}
              onChange={(value) => handleAddressChange('address', value)}
              placeholder="Enter your address"
              label="Your Address:"
            />
          </div>
          <div className='form-group'>
            <label>
              <input type="checkbox" name="hasCar" checked={userData.hasCar} onChange={handleInputChange} />
              Do you have a car?
            </label>
          </div>
          {userData.hasCar && (
            <>
              <div className='form-group'>
                <label>
                  <input type="checkbox" name="canGiveRides" checked={userData.canGiveRides} onChange={handleInputChange} />
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
                    onChange={handleInputChange} 
                    min="1" 
                    className='form-input'
                  />
                </div>
              )}
            </>
          )}
          <Button type="submit">Join Event</Button>
        </form>
        {error && <p className='error-message'>{error}</p>}
      </div>
    </div>
  );
};

export default JoinEvent;