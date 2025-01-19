import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingById, finishBooking } from "../../services/https/booking"; // Import finishBooking
import "./DriverOnTheWay.css"; // Reuse the same CSS file
import mapIcon from "../../assets/map.png";
import chatIcon from "../../assets/chat.png";
import { apiRequest } from "../../config/ApiService";
import { Endpoint } from "../../config/Endpoint";

interface DriverFinishProps {
  bookingId: number; // Accept bookingId as a prop to fetch booking details
}

const DriverFinish: React.FC<DriverFinishProps> = ({ bookingId }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState<string>(""); // State to store destination
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const bookingDetails = await getBookingById(String(bookingId)); // Fetch booking details
        if (bookingDetails && bookingDetails.terminus) {
          setDestination(bookingDetails.terminus); // Set the destination from API response
        } else {
          console.error("❌ No destination found in booking details");
          setDestination("Unknown Destination"); // Fallback value
        }
      } catch (error) {
        console.error("❌ Error fetching booking details:", error);
        setDestination("Error fetching destination"); // Error fallback
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleChatClick = () => {
    navigate("/DriverChat");
  };

  const handleFinishClick = async () => {
    try {
      setLoading(true);

      // Call finishBooking service
      const response = await finishBooking(String(bookingId));

      if (response.success) {
        alert("✅ Booking finished successfully!");

        // กดจบงานแล้วไปอัปเดตหน้า payment
        const notifyPayment = {
          id: String(bookingId),
          message: "update",
        };
        apiRequest("POST", Endpoint.PAYMENT_NOTIFY, notifyPayment);

        navigate("/Dashboards"); // Navigate to the Dashboards page
      } else {
        alert(`❌ Failed to finish booking: ${response.message}`);
      }
    } catch (error: any) {
      console.error("❌ Error finishing booking:", error.message || error);
      alert(`❌ Error: ${error.message || "Failed to finish booking"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="driver-on-the-way">
      <div className="driver-on-the-way-container">
        <div className="header">
          <img src={mapIcon} alt="Map Icon" className="icon" />
          {loading ? (
            <span>Loading destination...</span>
          ) : (
            <span>{destination}</span>
          )}
        </div>
        <button className="chat-button" onClick={handleChatClick}>
          <img src={chatIcon} alt="Chat Icon" />
          Chat with Passenger
        </button>
        <div className="driver-finish">
          <div className="button-container">
            <button className="finish-button" onClick={handleFinishClick}>
              Arrive at the destination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverFinish;
