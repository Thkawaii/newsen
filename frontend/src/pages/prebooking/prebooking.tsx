import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./prebooking.css";

interface BookingFormInputs {
  beginning: string;
  terminus: string;
  startTime: string;
  reminderTime: string;
  vehicle: string;
}

const PreBooking: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormInputs>();
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  const onSubmit: SubmitHandler<BookingFormInputs> = async (data) => {
    try {
      // ส่งข้อมูลไปที่ backend
      const response = await fetch("https://your-backend-api.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setBookingStatus("Booking successful!");
      } else {
        setBookingStatus("Failed to book. Please try again.");
      }
    } catch (error) {
      console.error("Error booking:", error);
      setBookingStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="pagesprebooking">
    <div className="pre-booking">
      <h1>Pre-Booking</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
        <div className="form-group">
          <label htmlFor="beginning">Pick-up Location</label>
          <input
            id="beginning"
            type="text"
            {...register("beginning", { required: "Pick-up location is required" })}
          />
          {errors.beginning && <p className="error">{errors.beginning.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="terminus">Drop-off Location</label>
          <input
            id="terminus"
            type="text"
            {...register("terminus", { required: "Drop-off location is required" })}
          />
          {errors.terminus && <p className="error">{errors.terminus.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            id="startTime"
            type="datetime-local"
            {...register("startTime", { required: "Start time is required" })}
          />
          {errors.startTime && <p className="error">{errors.startTime.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="reminderTime">Reminder Time</label>
          <input
            id="reminderTime"
            type="datetime-local"
            {...register("reminderTime", { required: "Reminder time is required" })}
          />
          {errors.reminderTime && <p className="error">{errors.reminderTime.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="vehicle">Vehicle</label>
          <select
            id="vehicle"
            {...register("vehicle", { required: "Vehicle type is required" })}
          >
            <option value="">Select a vehicle</option>
            <option value="car">Car</option>
            <option value="motorbike">Motorbike</option>
            <option value="van">Van</option>
          </select>
          {errors.vehicle && <p className="error">{errors.vehicle.message}</p>}
        </div>

        <button type="submit" className="btn-submit">Book Now</button>
      </form>

      {bookingStatus && <p className="status">{bookingStatus}</p>}
    </div>
    </div>
  );
};

export default PreBooking;
