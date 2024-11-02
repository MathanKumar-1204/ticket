import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { database } from './firebase'; // Import the initialized Firebase database
import { ref, get } from 'firebase/database';
import './FarePage.css';

const FarePage = () => {
  const { state } = useLocation();
  const { service, from, to, count } = state || {};
  const [baseFare, setBaseFare] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mapHtml, setMapHtml] = useState(null); // State to hold the HTML map
  const [error, setError] = useState(null); // State to hold any error messages
  const [currentLocation, setCurrentLocation] = useState(null); // State for current location
  const navigate = useNavigate();

  // Function to fetch the user's current location
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error fetching current location:', error);
          setError('Unable to fetch current location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    fetchCurrentLocation(); // Fetch current location when the component mounts
  }, []);

  useEffect(() => {
    if (from && to && currentLocation) {
      const fareRef = ref(database, `${from}/${to}`);
      const fromLocationRef = ref(database, `unique_locations/${from}`);
      const toLocationRef = ref(database, `unique_locations/${to}`);

      // Fetch fare data
      get(fareRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setBaseFare(snapshot.val());
          } else {
            console.log('No fare data available for this route');
            setBaseFare(0);
          }
        })
        .catch((error) => {
          console.error('Error fetching fare data:', error);
          setError('Error fetching fare data');
        });

      // Fetch latitude and longitude for 'from' and 'to' locations
      Promise.all([get(fromLocationRef), get(toLocationRef)])
        .then(([fromSnapshot, toSnapshot]) => {
          if (fromSnapshot.exists() && toSnapshot.exists()) {
            const fromData = fromSnapshot.val();
            const toData = toSnapshot.val();
            const mapData = {
              start_latitude: fromData.latitude,
              start_longitude: fromData.longitude,
              end_latitude: toData.latitude,
              end_longitude: toData.longitude,
              current_latitude: currentLocation.latitude, // Add current location latitude
              current_longitude: currentLocation.longitude, // Add current location longitude
            };

            console.log(mapData);

            // Send the latitude and longitude to the Flask backend using fetch
            fetch('http://localhost:5000/generate_map_with_current', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(mapData),
            })
              .then((response) => response.text()) // Get the HTML as text
              .then((html) => {
                setMapHtml(html); // Set the returned HTML map
              })
              .catch((error) => {
                console.error('Error generating map:', error);
                setError('Error generating map');
              });
          } else {
            console.log('Location data not available for the selected locations');
            setError('Location data not available for the selected locations');
          }
        })
        .catch((error) => {
          console.error('Error fetching location data:', error);
          setError('Error fetching location data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [from, to, currentLocation]);

  const calculateFare = () => {
    let fare = baseFare;
    switch (service) {
      case 'Express':
        fare += 5;
        break;
      case 'Deluxe':
        fare += 10;
        break;
      default:
        break;
    }
    return fare * count;
  };

  const totalFare = calculateFare();
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (<div class="fare">
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
    <div className="fare-container">
      
      {loading ? (
        <p>Loading fare details...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <h1>Total Fare</h1>
          <p>Service: {service}</p>
          <p>From: {from}</p>
          <p>To: {to}</p>
          <p>Count: {count}</p>
          <h2>Total Fare: ₹{totalFare}</h2>
          <button
            onClick={() =>
              navigate('/payment', {
                state: { totalFare, from, to, serviceType: service, count },
              })
            }
          >
            Pay Online
          </button>

          <div className="map-container">
            {mapHtml ? (
              <div dangerouslySetInnerHTML={{ __html: mapHtml }} />
            ) : (
              <p>Loading map...</p>
            )}
          </div>
        </>
      )}
    </div></div>
  );
};

export default FarePage;
