package entities

type Review struct {
	ReviewID    int    `json:"review_id" gorm:"primaryKey"`
	Rating      int    `json:"rating"`
	Comment     string `json:"comment"`
	BookingID   int    `json:"booking_id"`
	PassengerID int    `json:"passenger_id"`
	DriverID    int    `json:"driver_id"`
	Feedback    string `json:"feedback"`
}
