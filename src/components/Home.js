import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [numPeople, setNumPeople] = useState(1); // Default number of people is 1
  const [formData, setFormData] = useState({
    people: [
      { address: "", carOwner: false, canGiveRides: false }, // Initial person data
    ],
    meetingLocation: "",
  });

  const navigate = useNavigate();

  // Update the form data for each person
  const handlePersonChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const newPeople = [...formData.people];
    newPeople[index] = {
      ...newPeople[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData({
      ...formData,
      people: newPeople,
    });
  };

  // Update the number of people and initialize form fields accordingly
  const handleNumPeopleChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value < 1) return; // Ensure at least 1 person

    setNumPeople(value);
    const newPeople = [...formData.people];

    // Adjust the number of people in the form
    if (value > formData.people.length) {
      // Add new empty entries
      for (let i = formData.people.length; i < value; i++) {
        newPeople.push({ address: "", carOwner: false, canGiveRides: false });
      }
    } else {
      // Trim the people array
      newPeople.length = value;
    }

    setFormData({
      ...formData,
      people: newPeople,
    });
  };

  const handleMeetingLocationChange = (event) => {
    setFormData({
      ...formData,
      meetingLocation: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/result", { state: { formData } });
  };

  return (
    <div>
      <h1>Meet-Up Organizer</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Number of People:
          <input
            type="number"
            value={numPeople}
            onChange={handleNumPeopleChange}
            min="1"
            required
          />
        </label>

        {formData.people.map((person, index) => (
          <div key={index}>
            <h3>Person {index + 1}</h3>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={person.address}
                onChange={(e) => handlePersonChange(index, e)}
                required
              />
            </label>
            <label>
              Car Owner:
              <input
                type="checkbox"
                name="carOwner"
                checked={person.carOwner}
                onChange={(e) => handlePersonChange(index, e)}
              />
            </label>
            <label>
              Can Give Rides:
              <input
                type="checkbox"
                name="canGiveRides"
                checked={person.canGiveRides}
                onChange={(e) => handlePersonChange(index, e)}
              />
            </label>
          </div>
        ))}

        <label>
          Meeting Location (optional):
          <input
            type="text"
            name="meetingLocation"
            value={formData.meetingLocation}
            onChange={handleMeetingLocationChange}
            placeholder="Enter coordinates (e.g., -73.935242,40.730610)"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;
