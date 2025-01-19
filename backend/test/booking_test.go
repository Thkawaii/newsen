package test

import (
	"testing"
	"fmt"

	"project-se/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// setupTestBooking สร้างข้อมูล Booking สำหรับใช้ในแต่ละ Test Case
func setupTestBooking() entity.Booking {
	return entity.Booking{
		Beginning:       "Point A",
		Terminus:        "Point B",
		StartTime:       "08:00",
		EndTime:         "09:00",
		Distance:        15.5,
		TotalPrice:      200.0,
		BookingTime:     "2024-06-01T10:00:00Z",
		BookingStatus:   "Confirmed",
		Vehicle:         "Car",
		PassengerID:     1,
		DriverID:        2,
		StartLocationID: 1,
		DestinationID:   1,
	}
}

func TestBookingBeginning(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Beginning (Empty)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.Beginning = ""

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("Beginning is required."))
	})
}

func TestBookingTerminus(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Terminus (Empty)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.Terminus = "" // กำหนด Terminus เป็นค่าว่าง

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("Terminus is required."))
	})
}

func TestBookingStartTime(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid StartTime (Empty)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.StartTime = "" // กำหนด StartTime เป็นค่าว่าง

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("Start time is required."))
	})
}

func TestBookingEndTime(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid EndTime (Empty)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.EndTime = "" // กำหนด EndTime เป็นค่าว่าง

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("End time is required."))
	})
}


func TestBookingDistance(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Distance (Zero)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.Distance = 0.0

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("Distance is required."))
	})
}

func TestBookingTotalPrice(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid TotalPrice (Zero)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.TotalPrice = 0.0 // กำหนด TotalPrice เป็น 0.0

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("Total price is required."))
	})
}

func TestBookingTime(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid BookingTime (Empty)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.BookingTime = "" // กำหนด BookingTime เป็นค่าว่าง

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("Booking time is required."))
	})
}



func TestBookingStatus(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Booking Status (Empty)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.BookingStatus = ""

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("Booking status is required."))
	})
}

func TestBookingPassengerID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Passenger ID (Zero)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.PassengerID = 0

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("PassengerID is required."))
	})
}

func TestBookingVehicle(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Vehicle (Empty)", func(t *testing.T) {
		booking := setupTestBooking()
		booking.Vehicle = ""

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("Vehicle is required."))
	})
}

func TestValidBooking(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Valid Booking", func(t *testing.T) {
		booking := setupTestBooking()

		ok, err := govalidator.ValidateStruct(booking)
		if err != nil {
			fmt.Println("Validation Error:", err.Error())
		}

		g.Expect(ok).To(BeTrue()) // Validate ต้องผ่าน
		g.Expect(err).To(BeNil()) // ต้องไม่มีข้อผิดพลาด
	})
}
