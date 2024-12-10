import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EventRegistration = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    hasRide: '',
    canGiveRide: '',
    rideCapacity: '',
  });

  useEffect(() => {
    // In a real application, you would fetch event details from your server
    // using the eventId and set them in the state
    // For now, we'll just set a placeholder title
    setEventDetails({ title: 'Event Registration' });
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your server
    console.log('Registration submitted:', {
      eventId,
      ...formData,
    });
    alert('Registration submitted successfully!');
  };

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{eventDetails.title}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="hasRide">Do you have a ride?</label>
          <select
            id="hasRide"
            name="hasRide"
            value={formData.hasRide}
            onChange={handleInputChange}
            required
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {formData.hasRide === 'yes' && (
          <div>
            <label htmlFor="canGiveRide">Can you give rides?</label>
            <select
              id="canGiveRide"
              name="canGiveRide"
              value={formData.canGiveRide}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        )}
        {formData.canGiveRide === 'yes' && (
          <div>
            <label htmlFor="rideCapacity">How many people can you give rides to?</label>
            <input
              type="number"
              id="rideCapacity"
              name="rideCapacity"
              value={formData.rideCapacity}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EventRegistration;