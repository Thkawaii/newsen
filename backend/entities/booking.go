package entities

type Booking struct {
	ID              int     `json:"id"`
	Beginning       string  `json:"beginning"`
	Terminus        string  `json:"terminus"`
	StartTime       string  `json:"start_time"`
	EndTime         string  `json:"end_time"`
	Distance        float64 `json:"distance"`
	TotalPrice      float64 `json:"total_price"`
	BookingTime     string  `json:"booking_time"`
	BookingStatus   string  `json:"booking_status"`
	Vehicle         string  `json:"vehicle"`
	PassengerID     int     `json:"passenger_id"`
	DriverID        int     `json:"driver_id"`
	StartLocationID int     `json:"start_location_id"`
	DestinationID   int     `json:"destination_id"`
}
