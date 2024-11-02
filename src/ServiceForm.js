import React, { useState, useEffect } from 'react';
import { database } from './firebase'; // Import the initialized Firebase database
import { ref, onValue } from 'firebase/database';
import './ServiceForm.css'; // Import CSS for styling
import { useNavigate } from 'react-router-dom';

function ServiceForm() {
  const [locations, setLocations] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [service, setService] = useState('');
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const locationRef = ref(database, 'locations');

    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();

      if (Array.isArray(data)) {
        setLocations(data);
      } else if (data) {
        setLocations(Object.values(data));
      } else {
        setLocations([]);
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  useEffect(() => {
    if (inputValue) {
      const filtered = locations.filter(location =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }, [inputValue, locations]);

  useEffect(() => {
    if (destinationValue) {
      const filtered = locations.filter(location =>
        location.toLowerCase().includes(destinationValue.toLowerCase()) &&
        location.toLowerCase() !== inputValue.toLowerCase()
      );
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations([]);
    }
  }, [destinationValue, locations, inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestinationValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setFilteredLocations([]);
  };

  const handleDestinationClick = (suggestion) => {
    setDestinationValue(suggestion);
    setFilteredDestinations([]);
  };

  const handleSubmit = () => {
    navigate('/fare', {
      state: {
        service,
        from: inputValue,
        to: destinationValue,
        count: parseInt(count)
      }
    });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };
  const handleChat= () => {
    

    navigate('/chat'); // Redirect to the ChatApp page
  };
  return (
    <div className="main">
      {/* Navigation Bar */}
      <nav>
  <div className="navbar">
    <ul className="navbar-list">
      <li className="navbar-item" onClick={() => handleNavigation('/service')}>Home</li>
      <li className="navbar-item" onClick={() => handleNavigation('/pass')}>BusPass</li>
      <li className="navbar-item" onClick={() => handleNavigation('/feedback')}>Feedback</li>
      <li className="navbar-item" onClick={() => handleNavigation('/')}>Logout</li>
    </ul>
  </div>
</nav>


      <div className="form-container">
        <h1>Service Form</h1>
        <form className="service-form">
          <div className="form-group">
            <label htmlFor="service">Select Service</label>
            <select id="service" onChange={(e) => setService(e.target.value)} value={service}>
              <option value="">Select Service</option>
              <option value="Ordinary">Ordinary Service</option>
              <option value="Express">Express Service</option>
              <option value="Deluxe">Deluxe Service</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="from">From</label>
            <input
              type="text"
              id="from"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search location"
            />
            {filteredLocations.length > 0 && (
              <ul className="suggestions-list">
                {filteredLocations.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            {filteredLocations.length === 0 && inputValue && (
              <p>No locations found</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="to">To</label>
            <input
              type="text"
              id="to"
              value={destinationValue}
              onChange={handleDestinationChange}
              placeholder="Search destination"
            />
            {filteredDestinations.length > 0 && (
              <ul className="suggestions-list">
                {filteredDestinations.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleDestinationClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            {filteredDestinations.length === 0 && destinationValue && (
              <p>No destinations found</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="count">Count</label>
            <input
              type="number"
              id="count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
            />
          </div>

          <div className="form-group">
            <button type="button" onClick={handleSubmit}>Generate Ticket</button>
          </div>
        </form>
        <button className="floating-btn" onClick={() => handleChat()}>
        <span class="material-symbols-outlined">
chat
</span>
  </button>
      </div>
    </div>
  );
}

export default ServiceForm;
