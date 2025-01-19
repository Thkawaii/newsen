import React, { useEffect, useRef } from "react";
import "./DriverTrackingPage.css";

const DriverTrackingPage: React.FC = () => {
  
  return (
    <div className="driver-tracking-page">
      <div
        className="map-container"
       
        style={{ height: "50vh", width: "100%" }}
      ></div>
      <div className="details-container">
        <div className="driver-details">
          <h2>Your Captain is on the way 🚗</h2>
          <div className="driver-info">
            <img
              src="https://via.placeholder.com/100" // Placeholder for driver photo
              alt="Driver"
              className="driver-photo"
            />
            <div>
              <h3>Sayeed Husein</h3>
              <p>White Lexus ES300H</p>
              <p>L82497</p>
              <p>⭐ 4.6</p>
            </div>
          </div>
          <div className="action-buttons">
            <button className="call-button">Call Captain</button>
            <button className="share-button">Share Detail</button>
          </div>
        </div>
        <div className="trip-details">
          <h3>Trip Details</h3>
          <p>
            <strong>Pickup:</strong> Union Coop Al - St. 78
          </p>
          <p>
            <strong>Dropoff:</strong> Emaar Dubai Hills Estate
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverTrackingPage;
