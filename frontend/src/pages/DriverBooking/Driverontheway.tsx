import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingById } from '../../services/https/booking'; // Import the function
import './DriverOnTheWay.css';
import mapIcon from '../../assets/map.png';
import chatIcon from '../../assets/chat.png';

interface DriverOnTheWayProps {
  bookingId: number; // Accept bookingId as a prop to fetch booking details
}

const DriverOnTheWay: React.FC<DriverOnTheWayProps> = ({ bookingId }) => {
  const navigate = useNavigate();
  const [buttonState, setButtonState] = useState<'arrive' | 'pickup'>('arrive');
  const [startLocation, setStartLocation] = useState<string>(''); // State to store start location
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const bookingDetails = await getBookingById(String(bookingId)); // Fetch booking details
        if (bookingDetails && bookingDetails.beginning) {
          setStartLocation(bookingDetails.beginning); // Set the startLocation from API response
        } else {
          console.error('❌ No start location found in booking details');
          setStartLocation('Unknown Location'); // Fallback value
        }
      } catch (error) {
        console.error('❌ Error fetching booking details:', error);
        setStartLocation('Error fetching location'); // Error fallback
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleChatClick = () => {
    navigate('/DriverChat');
  };

  const handleArriveClick = () => {
    setButtonState('pickup');
  };

  const handlePickupClick = () => {
    navigate('/DriverFinish');
  };

  return (
    <div className="driver-on-the-way">
      <div className="driver-on-the-way-container">
        <div className="header">
          <img src={mapIcon} alt="Map Icon" className="icon" />
          {loading ? <span>Loading location...</span> : <span>{startLocation}</span>}
        </div>
        <button className="chat-button" onClick={handleChatClick}>
          <img src={chatIcon} alt="Chat Icon" />
          Chat with Passenger
        </button>
        <div className="button-container">
          <button
            className={`action-button ${buttonState === 'arrive' ? 'active' : ''}`}
            onClick={handleArriveClick}
            disabled={buttonState === 'pickup'}
          >
            Arrive at the pick-up point
          </button>
          <button
            className={`action-button ${buttonState === 'pickup' ? 'active' : ''}`}
            onClick={handlePickupClick}
            disabled={buttonState === 'arrive'}
          >
            Pick up passengers
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverOnTheWay;
