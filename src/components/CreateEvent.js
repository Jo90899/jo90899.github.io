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
  
  // New state for CSV upload
  const [participantFile, setParticipantFile] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const [eventLink, setEventLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Existing handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAddressChange = (name, value) => {
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  // New handler for CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParticipantFile(file);
      processCSVFile(file);
    }
  };
  
  // Process the CSV file to extract participant data
  const processCSVFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const csvData = e.target.result;
      const lines = csvData.split('\n');
      const headers = lines[0].split(',');
      
      // Find index of name and email columns
      const nameIndex = headers.findIndex(h => h.toLowerCase().trim() === 'name');
      const emailIndex = headers.findIndex(h => h.toLowerCase().trim() === 'email');
      
      if (nameIndex === -1 || emailIndex === -1) {
        setUploadStatus('Error: CSV must contain "name" and "email" columns');
        return;
      }
      
      // Process participant data
      const participantList = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',');
        participantList.push({
          name: values[nameIndex].trim(),
          email: values[emailIndex].trim()
        });
      }
      
      setParticipants(participantList);
      setUploadStatus(`Successfully loaded ${participantList.length} participants`);
    };
    
    reader.onerror = () => {
      setUploadStatus('Error reading file');
    };
    
    reader.readAsText(file);
  };

  // Modified submit handler to include sending invitations
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create the event
      const response = await fetch('https://gather-maps.com:5050/components/create-event', {
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
      setEventLink(`${window.location.origin}/my-event/${eventId}`);
      
      // If main user is participating, join the event
      if (participateInEvent) {
        const joinResponse = await fetch(`https://gather-maps.com:5050/join-event/${eventId}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userData),
        });
        
        if (!joinResponse.ok) {
          throw new Error('Failed to join event');
        }
      }
      
      // If there are participants from CSV, send invitations
      if (participants.length > 0) {
        const inviteResponse = await fetch(`https://gather-maps.com:5050/invite-participants/${eventId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ participants }),
        });
        
        if (!inviteResponse.ok) {
          throw new Error('Failed to send invitations');
        }
        
        const inviteResult = await inviteResponse.json();
        setUploadStatus(`Sent invitations to ${inviteResult.sentCount} participants`);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('There was a problem. Please try again.');
    }
  };

  return (
    <div className="create-event-body">
      <div className="create-event-container">
        <h2 className="create-event-title">Create a New Event</h2>
      
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      
        {eventLink ? (
          <>
            <div className="success-message">
              <p>Event created successfully! Share this link with participants:</p>
              <a href={eventLink} target="_blank" rel="noopener noreferrer">{eventLink}</a>
            </div>
            {uploadStatus && <p>{uploadStatus}</p>}
          </>
          ) : (
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
          
            {/* New CSV upload section */}
            <div className="form-group">
              <label>Upload Participant List (CSV)</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
              <small>CSV must include 'name' and 'email' columns</small>
              {uploadStatus && <p>{uploadStatus}</p>}
              {participants.length > 0 && (
                <p>{participants.length} participants loaded from CSV</p>
              )}
            </div>
          
            <Button type="submit">Create Event</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
