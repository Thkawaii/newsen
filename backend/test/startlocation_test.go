package test

import (
	"testing"
	"project-se/entity" 
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestLatitude(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Latitude is required`, func(t *testing.T) {
		location := entity.StartLocation{
			Latitude:  0.0, // ค่าเริ่มต้นที่ไม่ถูกต้อง
			Longitude: 100.12345,
			Province:  "Bangkok",
			Place:     "Central Plaza",
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(location)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Latitude is required"))
	})
}

func TestLongitude(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Longitude is required`, func(t *testing.T) {
		location := entity.StartLocation{
			Latitude:  13.75633,
			Longitude: 0.0, // ค่าเริ่มต้นที่ไม่ถูกต้อง
			Province:  "Bangkok",
			Place:     "Central Plaza",
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(location)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Longitude is required"))
	})
}

func TestProvince(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Province is required`, func(t *testing.T) {
		location := entity.StartLocation{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Province:  "", // Province ว่าง
			Place:     "Central Plaza",
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(location)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Province is required"))
	})
}

func TestPlace(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Place is required`, func(t *testing.T) {
		location := entity.StartLocation{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Province:  "Bangkok",
			Place:     "", // Place ว่าง
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(location)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Place is required"))
	})
}

func TestValidStartLocation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Valid StartLocation`, func(t *testing.T) {
		location := entity.StartLocation{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Province:  "Bangkok",
			Place:     "Central Plaza",
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(location)

		g.Expect(ok).To(BeTrue()) // Validate ต้องผ่าน
		g.Expect(err).To(BeNil()) // ต้องไม่มีข้อผิดพลาด
	})
}
