package test

import (
	"testing"
	"time"

	"project-se/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestTrainerFirstname(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Firstname is required`, func(t *testing.T) {
		trainer := entity.Trainers{
			FirstName: "", // เว้นว่างเพื่อทดสอบ
			LastName:  "Doe",
			Email:     "trainer@example.com",
			BirthDay:  time.Now().AddDate(-30, 0, 0),
			GenderID:  1,
			RoleID:    1,
		}

		ok, err := govalidator.ValidateStruct(trainer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("FirstName is required"))
	})
}

func TestTrainerLastname(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Lastname is required`, func(t *testing.T) {
		trainer := entity.Trainers{
			FirstName: "John",
			LastName:  "", // เว้นว่างเพื่อทดสอบ
			Email:     "trainer@example.com",
			BirthDay:  time.Now().AddDate(-30, 0, 0),
			GenderID:  1,
			RoleID:    1,
		}

		ok, err := govalidator.ValidateStruct(trainer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("LastName is required"))
	})
}

func TestTrainerEmail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Email is required`, func(t *testing.T) {
		trainer := entity.Trainers{
			FirstName: "John",
			LastName:  "Doe",
			Email:     "", // เว้นว่างเพื่อทดสอบ
			BirthDay:  time.Now().AddDate(-30, 0, 0),
			GenderID:  1,
			RoleID:    1,
		}

		ok, err := govalidator.ValidateStruct(trainer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Email is required"))
	})

	t.Run(`Email format is invalid`, func(t *testing.T) {
		trainer := entity.Trainers{
			FirstName: "John",
			LastName:  "Doe",
			Email:     "invalid-email", // ฟอร์แมตไม่ถูกต้อง
			BirthDay:  time.Now().AddDate(-30, 0, 0),
			GenderID:  1,
			RoleID:    1,
		}

		ok, err := govalidator.ValidateStruct(trainer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Email is invalid"))
	})
}

func TestTrainerDateOfBirth(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`DateOfBirth is required`, func(t *testing.T) {
		trainer := entity.Trainers{
			FirstName: "John",
			LastName:  "Doe",
			Email:     "trainer@example.com",
			BirthDay:  time.Time{}, // ไม่กำหนดค่าวันเกิด
			GenderID:  1,
			RoleID:    1,
		}

		ok, err := govalidator.ValidateStruct(trainer)

		// ตรวจสอบเฉพาะ DateOfBirth
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("DateOfBirth is required"))
	})
}

func TestTrainerValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Valid Trainer`, func(t *testing.T) {
		trainer := entity.Trainers{
			FirstName: "John",
			LastName:  "Doe",
			Email:     "trainer@example.com",
			BirthDay:  time.Now().AddDate(-30, 0, 0),
			GenderID:  1,
			RoleID:    1,
		}

		ok, err := govalidator.ValidateStruct(trainer)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
