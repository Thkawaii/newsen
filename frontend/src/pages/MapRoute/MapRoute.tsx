import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { FaMotorcycle, FaCar, FaTruckPickup } from "react-icons/fa";
import "./MapRoute.css";
import { sendBookingToBackend } from "../../services/https/booking";
import { sendBookingStatusToBackend } from "../../services/https/statusbooking/statusbooking";
import { message } from "antd";

const vehicles = [
  { id: 1, name: "cabanabike", baseFare: 20, perKm: 5, capacity: 2, type: "motorcycle", icon: <FaMotorcycle size={50} /> },
  { id: 2, name: "cabanacar", baseFare: 40, perKm: 8, capacity: 4, type: "car", icon: <FaCar size={50} /> },
  { id: 3, name: "cabana luxe", baseFare: 60, perKm: 10, capacity: 6, type: "special", icon: <FaTruckPickup size={50} /> },
];

const MapRoute: React.FC = () => {
  const location = useLocation();
  const { pickupLocation, startLocationId, destinationLocation, destinationId } = location.state || {};
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [directions, setDirections] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  
    // ดึงข้อมูล Passenger จาก localStorage
    const passengerId = localStorage.getItem("id");
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    console.log("JWT Token:", token);
    console.log("User Role:", userRole);
    console.log("Passenger ID:", passengerId);

    


  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const existingScript = document.getElementById("google-maps-api");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
        script.id = "google-maps-api";
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.head.appendChild(script);
      } else {
        setIsLoaded(true);
      }
    };

    loadGoogleMapsAPI();
  }, []);

  useEffect(() => {
    if (pickupLocation && destinationLocation && isLoaded) {
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: { lat: pickupLocation.lat, lng: pickupLocation.lng },
        destination: { lat: destinationLocation.lat, lng: destinationLocation.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const distanceInMeters = result.routes[0].legs[0].distance.value;
          const distanceInKm = distanceInMeters / 1000;
          setDistance(distanceInKm);
        } else {
          console.error("Error fetching directions", status);
        }
      });
    }
  }, [pickupLocation, destinationLocation, isLoaded]);

  const handleSelectVehicle = (id: number) => {
    setSelectedVehicle(id);
    const selectedVehicleData = vehicles.find((v) => v.id === id);

    if (distance && selectedVehicleData) {
      const calculatedFare = selectedVehicleData.baseFare + selectedVehicleData.perKm * distance;
      setFare(calculatedFare);
    }
  };

  const handleBooking = async () => {
    const passengerId = localStorage.getItem("id");

    if (!passengerId) {
      //message.error("Passenger ID not found in localStorage. Please log in again.");
  
      return;
    }

    if (!selectedVehicle || distance === null) {
      setSuccessMessage("กรุณาเลือกยานพาหนะและตรวจสอบข้อมูลให้ครบถ้วน");
      return;
    }

    if (!pickupLocation || !destinationLocation || !startLocationId || !destinationId) {
      setSuccessMessage("ข้อมูลสถานที่เริ่มต้นหรือจุดหมายปลายทางไม่ครบถ้วน");
      return;
    }

    const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle);

    const bookingData: any = {
      beginning: pickupLocation.name || "",
      terminus: destinationLocation.name || "",
      start_time: new Date().toISOString(),
      end_time: "",
      distance: parseFloat(distance.toFixed(2)),
      total_price: parseFloat(fare?.toFixed(2) || "0"),
      booking_time: new Date().toISOString(),
      booking_status: "Pending",
      vehicle: selectedVehicleData?.name || "",
      start_location_id: startLocationId,
      destination_id: destinationId,
      passenger_id: parseInt(passengerId, 10),
    };

    try {
      const result = await sendBookingToBackend(bookingData);

      if (result.success) {
        setSuccessMessage("🎉 การจองสำเร็จ!");
        const bookingId = result.data.data.ID;

        const bookingStatusData = {
          booking_id: bookingId,
          status_booking: "Pending",
        };

        try {
          const bookingStatusResult = await sendBookingStatusToBackend(bookingStatusData);

          if (bookingStatusResult.success) {
            console.log("Booking status saved successfully:", bookingStatusResult.data);
            setTimeout(() => {
              navigate(`/paid/${bookingId}`);
            }, 2000);
          } else {
            console.error("Failed to save booking status:", bookingStatusResult.message);
          }
        } catch (error) {
          console.error("Error saving booking status:", error);
        }
      } else {
        setSuccessMessage(`เกิดข้อผิดพลาด: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setSuccessMessage("ไม่สามารถบันทึกข้อมูลการจองได้");
    }
  };

  if (!isLoaded) return <div>กำลังโหลดแผนที่...</div>;

  return (
    <div className="MapRoute">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={12}
        center={pickupLocation || { lat: 13.736717, lng: 100.523186 }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {pickupLocation && <Marker position={pickupLocation} label="Pickup" />}
        {destinationLocation && <Marker position={destinationLocation} label="Destination" />}
      </GoogleMap>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="ticket-container">
        {vehicles.map((vehicle, index) => {
          const fareForVehicle = distance !== null ? vehicle.baseFare + vehicle.perKm * distance : null;

          return (
            <div key={vehicle.id} className={`ticket ${selectedVehicle === vehicle.id ? "selected" : ""}`}>
              <div className="dashed-border">
                <div
                  className={`vehicle-item ${index % 2 === 0 ? "even" : "odd"}`}
                  onClick={() => handleSelectVehicle(vehicle.id)}
                >
                  <div className="vehicle-icon">{vehicle.icon}</div>
                  <div className="vehicle-info">
                    <h3>{vehicle.name}</h3>
                    <p>x{vehicle.capacity}</p>
                    {distance !== null && <p>Distance: {distance.toFixed(2)} Km</p>}
                    {fareForVehicle !== null && <p>Fare: {fareForVehicle.toFixed(2)} Baht</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="booking-button-container">
        <button className="booking-button" onClick={handleBooking} disabled={!selectedVehicle || distance === null}>
          Booking Cabana
        </button>
      </div>
    </div>
  );
};

export default MapRoute;
