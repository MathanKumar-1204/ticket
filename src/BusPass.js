// BusPass.js
import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './BusPass.css';

function BusPass() {
  const [name, setName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [locations, setLocations] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [count, setCount] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionDuration, setSubscriptionDuration] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const locationRef = ref(database, 'locations');
    const unsubscribe = onValue(
      locationRef,
      (snapshot) => {
        const data = snapshot.val();
        setLocations(data ? Object.values(data) : []);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredLocations([]);
      return;
    }
    const filtered = locations.filter((location) =>
      location.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [inputValue, locations]);

  useEffect(() => {
    if (destinationValue.trim() === '') {
      setFilteredDestinations([]);
      return;
    }
    const filtered = locations.filter(
      (location) =>
        location.toLowerCase().includes(destinationValue.toLowerCase()) &&
        location.toLowerCase() !== inputValue.toLowerCase()
    );
    setFilteredDestinations(filtered);
  }, [destinationValue, locations, inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !aadhaarNumber.trim() ||
      !inputValue.trim() ||
      !destinationValue.trim() ||
      count <= 0
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(aadhaarNumber)) {
      alert('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    let subscriptionAmount = 0;
    if (isSubscribed) {
      if (!subscriptionDuration) {
        alert('Please select a subscription duration.');
        return;
      }
      subscriptionAmount = parseInt(subscriptionDuration, 10);
    }

    const passData = {
      name: name.trim(),
      aadhaarNumber: aadhaarNumber.trim(),
      from: inputValue.trim(),
      to: destinationValue.trim(),
      count: parseInt(count, 10),
      isSubscribed,
      subscriptionAmount,
    };

    // Navigate to QR Code Page with passData
    navigate('/qr-code', {
      state: { passData },
    });
  };

  return (
    <div className="form-container">
      <h1>Bus Pass Application</h1>
      <form className="service-form" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Name<span className="required">*</span></label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Aadhaar Number Field */}
        <div className="form-group">
          <label htmlFor="aadhaarNumber">Aadhaar Number<span className="required">*</span></label>
          <input
            type="text"
            id="aadhaarNumber"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            placeholder="Enter your Aadhaar number"
            required
            maxLength="12"
            pattern="\d{12}"
            title="Please enter a 12-digit Aadhaar number."
          />
        </div>

        {/* From Location Field */}
        <div className="form-group">
          <label htmlFor="from">From<span className="required">*</span></label>
          <input
            type="text"
            id="from"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search location"
            required
            autoComplete="off"
          />
          {filteredLocations.length > 0 && (
            <ul className="suggestions-list">
              {filteredLocations.map((loc, index) => (
                <li key={index} onClick={() => setInputValue(loc)}>
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* To Location Field */}
        <div className="form-group">
          <label htmlFor="to">To<span className="required">*</span></label>
          <input
            type="text"
            id="to"
            value={destinationValue}
            onChange={(e) => setDestinationValue(e.target.value)}
            placeholder="Search destination"
            required
            autoComplete="off"
          />
          {filteredDestinations.length > 0 && (
            <ul className="suggestions-list">
              {filteredDestinations.map((loc, index) => (
                <li key={index} onClick={() => setDestinationValue(loc)}>
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Count Field */}
        <div className="form-group">
          <label htmlFor="count">Count<span className="required">*</span></label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            required
          />
        </div>

        {/* Subscription Option */}
        <div className="form-group checkbox-group">
          <label htmlFor="subscription">Subscribe for a Bus Pass?</label>
          <input
            type="checkbox"
            id="subscription"
            checked={isSubscribed}
            onChange={(e) => setIsSubscribed(e.target.checked)}
          />
        </div>

        {/* Subscription Duration Selection */}
        {isSubscribed && (
          <div className="form-group">
            <label htmlFor="subscriptionDuration">Select Subscription Duration<span className="required">*</span></label>
            <select
              id="subscriptionDuration"
              onChange={(e) => setSubscriptionDuration(e.target.value)}
              value={subscriptionDuration}
              required={isSubscribed}
            >
              <option value="">-- Select Amount --</option>
              <option value="280">Rs.280</option>
              <option value="370">Rs.370</option>
              <option value="1000">Rs.1000</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit">Proceed to Payment</button>
        </div>
      </form>
    </div>
  );
}

export default BusPass;
