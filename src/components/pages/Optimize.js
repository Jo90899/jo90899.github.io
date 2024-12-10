import React, { useState, useEffect, useRef } from 'react';
import '../../App.css';
import RideResults from '../EventResults';
import { Button } from '../Button';

export default function Optimize() {
    const [numPeople, setNumPeople] = useState('');
    const [eventAddress, setEventAddress] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showNextSection, setShowNextSection] = useState(false);
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
        setEventAddress(e.target.value);
        setShowSuggestions(true);
        if (e.target.value.length > 2) {
            fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(e.target.value)}.json?access_token=pk.eyJ1Ijoiam9zZXBoLWFiZGVsbWFsZWsiLCJhIjoiY20wc2cwZWFrMGszcjJpb2tobDlhOHQ2dyJ9.a-V3HIO9OI3ACDAp9GyBaQ&autocomplete=true`
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
        setEventAddress(suggestion);
        setShowSuggestions(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (numPeople && eventAddress) {
            setShowNextSection(true);
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <>
            <h1 className="optimize">Start Gathering</h1>
            <h1 className="body">
                <div className="body-container">
                    <form onSubmit={handleSubmit}>
                        <ul className='body-title-text'>Event Information</ul>
                        <li className='body-inner-text'>
                            How many people are going to the event?
                            <input
                                type="number"
                                value={numPeople}
                                onChange={(e) => setNumPeople(e.target.value)}
                                min="1"
                                required
                            />
                        </li>
                        <li className='body-inner-text'>
                            Event Address:
                            <div className="autocomplete-container">
                                <input
                                type="text"
                                value={eventAddress}
                                onChange={handleAddressChange}
                                placeholder="Enter event address"
                                required
                                className="autocomplete-input"
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                <ul className="autocomplete-suggestions-list">
                                    {suggestions.map((suggestion, index) => (
                                    <li 
                                        key={index} 
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="autocomplete-suggestion-item"
                                    >
                                        {suggestion}
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </div>
                        </li>
                        <>
                            <Button
                            type="submit"
                            buttonStyle='btn--primary'
                            buttonSize='btn--medium'
                            >
                                Next
                            </Button>
                        </>
                    </form>
                </div>
            </h1>
            <div>
                {showNextSection && <RideResults numPeople={numPeople} eventAddress={eventAddress}/>}
            </div>
        </>
    )
}