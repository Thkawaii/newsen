package test

import (
	
	"testing"
	"project-se/entity" 
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestUserName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`username is required`, func(t *testing.T) {
		passenger := entity.Passenger{
			UserName:   "", // ผิดตรงนี้
			FirstName:  "John",
			LastName:   "Doe",
			PhoneNumber: "0801234567",
			Email:      "john.doe@example.com",
			Password:   "securePassword123",
			GenderID:   1,
			RoleID:     1,
		}

		ok, err := govalidator.ValidateStruct(passenger)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Username is required."))
	})
}

func TestPhoneNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`phone_number is required`, func(t *testing.T) {
		passenger := entity.Passenger{
			UserName:   "johndoe",
			FirstName:  "John",
			LastName:   "Doe",
			PhoneNumber: "", // ผิดตรงนี้
			Email:      "john.doe@example.com",
			Password:   "securePassword123",
			GenderID:   1,
			RoleID:     1,
		}

		ok, err := govalidator.ValidateStruct(passenger)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PhoneNumber is required"))
	})

	t.Run(`phone_number must be 10 digits`, func(t *testing.T) {
		passenger := entity.Passenger{
			UserName:   "johndoe",
			FirstName:  "John",
			LastName:   "Doe",
			PhoneNumber: "08012345678", // ผิดตรงนี้ (11 หลัก)
			Email:      "john.doe@example.com",
			Password:   "securePassword123",
			GenderID:   1,
			RoleID:     1,
		}

		ok, err := govalidator.ValidateStruct(passenger)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PhoneNumber must be 10 digits"))
	})

	t.Run(`phone_number is valid`, func(t *testing.T) {
		passenger := entity.Passenger{
			UserName:   "johndoe",
			FirstName:  "John",
			LastName:   "Doe",
			PhoneNumber: "0801234567", // ถูกต้อง
			Email:      "john.doe@example.com",
			Password:   "securePassword123",
			GenderID:   1,
			RoleID:     1,
		}

		ok, err := govalidator.ValidateStruct(passenger)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}


func TestEmail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`email is required`, func(t *testing.T) {
		passenger := entity.Passenger{
			UserName:   "johndoe",
			FirstName:  "John",
			LastName:   "Doe",
			PhoneNumber: "0801234567",
			Email:      "", // ผิดตรงนี้
			Password:   "securePassword123",
			GenderID:   1,
			RoleID:     1,
		}

		ok, err := govalidator.ValidateStruct(passenger)


		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Email is required"))
	})

	t.Run(`email format is invalid`, func(t *testing.T) {
		passenger := entity.Passenger{
			UserName:   "johndoe",
			FirstName:  "John",
			LastName:   "Doe",
			PhoneNumber: "0801234567",
			Email:      "invalid-email", // ผิดรูปแบบ
			Password:   "securePassword123",
			GenderID:   1,
			RoleID:     1,
		}

		ok, err := govalidator.ValidateStruct(passenger)


		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Email is invalid"))
	})

	t.Run(`email is valid`, func(t *testing.T) {
		passenger := entity.Passenger{
			UserName:   "johndoe",
			FirstName:  "John",
			LastName:   "Doe",
			PhoneNumber: "0801234567",
			Email:      "john.doe@example.com", // ถูกต้อง
			Password:   "securePassword123",
			GenderID:   1,
			RoleID:     1,
		}

		
		ok, err := govalidator.ValidateStruct(passenger)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
