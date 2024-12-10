import React, { useState, useEffect, useRef } from 'react';
import './AddressAutocomplete.css';

export default function AddressAutocomplete({ value, onChange, placeholder = "Enter address" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  const handleAddressChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    if (newValue.length > 2) {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newValue)}.json?access_token=pk.eyJ1Ijoiam9zZXBoLWFiZGVsbWFsZWsiLCJhIjoiY20wc2cwZWFrMGszcjJpb2tobDlhOHQ2dyJ9.a-V3HIO9OI3ACDAp9GyBaQ&autocomplete=true`
      )
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data.features.map((feature) => feature.place_name));
        })
        .catch((error) => console.error('Error fetching autocomplete suggestions:', error));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={value}
        onChange={handleAddressChange}
        placeholder={placeholder}
        className="autocomplete-input"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="autocomplete-suggestions-list" ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="autocomplete-suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}