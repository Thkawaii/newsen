package test

import (
	"testing"
	"project-se/entity" 
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestDestinationLatitude(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Latitude is required`, func(t *testing.T) {
		dest := entity.Destination{
			Latitude:  0.0, // ค่าว่างสำหรับ Latitude
			Longitude: 100.12345,
			Province:  "Bangkok",
			Place:     "Grand Palace",
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(dest)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Latitude is required"))
	})
}

func TestDestinationLongitude(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Longitude is required`, func(t *testing.T) {
		dest := entity.Destination{
			Latitude:  13.75633,
			Longitude: 0.0, // ค่าว่างสำหรับ Longitude
			Province:  "Bangkok",
			Place:     "Grand Palace",
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(dest)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Longitude is required"))
	})
}

func TestDestinationProvince(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Province is required`, func(t *testing.T) {
		dest := entity.Destination{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Province:  "", // Province ว่าง
			Place:     "Grand Palace",
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(dest)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Province is required"))
	})
}

func TestDestinationPlace(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Place is required`, func(t *testing.T) {
		dest := entity.Destination{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Province:  "Bangkok",
			Place:     "", // Place ว่าง
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(dest)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Place is required"))
	})
}

func TestValidDestination(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Valid Destination`, func(t *testing.T) {
		dest := entity.Destination{
			Latitude:  13.75633,
			Longitude: 100.12345,
			Province:  "Bangkok",
			Place:     "Grand Palace",
			Address:   "123 Main St",
		}

		ok, err := govalidator.ValidateStruct(dest)

		g.Expect(ok).To(BeTrue()) // Validate ต้องผ่าน
		g.Expect(err).To(BeNil()) // ต้องไม่มีข้อผิดพลาด
	})
}
