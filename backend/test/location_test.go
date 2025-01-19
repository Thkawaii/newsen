package test

import (
	
	"testing"
	"project-se/entity" 
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestLocationLatitude(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Latitude (Zero)", func(t *testing.T) {
		location := entity.Location{
			Latitude:  0.0,
			Longitude: 100.12345,
			Address:   "123 Main St",
			Province:  "Bangkok",
			Place:     "Central Plaza",
			Timestamp: "2024-06-01T10:00:00Z",
			DriverID:  1,
		}

		ok, err := govalidator.ValidateStruct(location)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Latitude is required"))
	})
}


func TestLocationLongitude(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Longitude (Zero)", func(t *testing.T) {
		location := entity.Location{
			Latitude:  13.75633,
			Longitude: 0.0,
			Address:   "123 Main St",
			Province:  "Bangkok",
			Place:     "Central Plaza",
			Timestamp: "2024-06-01T10:00:00Z",
			DriverID:  1,
		}

		ok, err := govalidator.ValidateStruct(location)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Longitude is required"))
	})
}

func TestLocationAddress(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Address (Empty)", func(t *testing.T) {
		location := entity.Location{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Address:   "",
			Province:  "Bangkok",
			Place:     "Central Plaza",
			Timestamp: "2024-06-01T10:00:00Z",
			DriverID:  1,
		}

		ok, err := govalidator.ValidateStruct(location)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Address is required"))
	})
}

func TestLocationProvince(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Province (Empty)", func(t *testing.T) {
		location := entity.Location{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Address:   "123 Main St",
			Province:  "",
			Place:     "Central Plaza",
			Timestamp: "2024-06-01T10:00:00Z",
			DriverID:  1,
		}

		ok, err := govalidator.ValidateStruct(location)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Province is required"))
	})
}

func TestLocationPlace(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid Place (Empty)", func(t *testing.T) {
		location := entity.Location{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Address:   "123 Main St",
			Province:  "Bangkok",
			Place:     "",
			Timestamp: "2024-06-01T10:00:00Z",
			DriverID:  1,
		}

		ok, err := govalidator.ValidateStruct(location)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Place is required"))
	})
}

func TestLocationDriverID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Invalid DriverID (Zero)", func(t *testing.T) {
		location := entity.Location{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Address:   "123 Main St",
			Province:  "Bangkok",
			Place:     "Central Plaza",
			Timestamp: "2024-06-01T10:00:00Z",
			DriverID:  0,
		}

		ok, err := govalidator.ValidateStruct(location)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("DriverID is required"))
	})
}

func TestValidLocation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Valid Location", func(t *testing.T) {
		location := entity.Location{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Address:   "123 Main St",
			Province:  "Bangkok",
			Place:     "Central Plaza",
			Timestamp: "2024-06-01T10:00:00Z",
			DriverID:  1,
		}

		ok, err := govalidator.ValidateStruct(location)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
