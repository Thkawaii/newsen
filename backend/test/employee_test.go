package test

import (
	"testing"
	"time"

	"project-se/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestEmployeeFirstname(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Firstname is required`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "", // เว้นว่างเพื่อทดสอบ
			Lastname:    "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "john.doe@example.com",
			Password:    "password123",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("FirstName is required"))
	})
}

func TestEmployeeLastname(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Lastname is required`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "", // เว้นว่างเพื่อทดสอบ
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "john.doe@example.com",
			Password:    "password123",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Lastname is required"))
	})
}

func TestEmployeePhoneNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`PhoneNumber is required`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "Doe",
			PhoneNumber: "", // เว้นว่าง
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "john.doe@example.com",
			Password:    "password123",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PhoneNumber is required"))
	})

	t.Run(`PhoneNumber must start with 0 and contain exactly 10 digits`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "Doe",
			PhoneNumber: "1234567890", // ไม่เริ่มด้วย 0
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "john.doe@example.com",
			Password:    "password123",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PhoneNumber must start with 0 and contain exactly 10 digits"))
	})
}

func TestEmployeeDateOfBirth(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`DateOfBirth is required`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Time{}, // ไม่กำหนดค่า
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "john.doe@example.com",
			Password:    "password123",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("DateOfBirth is required"))
	})
}

func TestEmployeeSalary(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Salary is required`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      0.0, // ไม่กำหนดค่า
			Email:       "john.doe@example.com",
			Password:    "password123",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Salary is required"))
	})
}

func TestEmployeeEmail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Email is required`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "", // ทดสอบ Email เว้นว่าง
			Password:    "password123",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Email is required"))
	})

	t.Run(`Email format is invalid`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "invalid-email", // ฟอร์แมตอีเมลไม่ถูกต้อง
			Password:    "password123",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Email is invalid"))
	})
}

func TestEmployeePassword(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Password is required`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "john.doe@example.com",
			Password:    "", // เว้นว่าง Password
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Password is required"))
	})
}

func TestValidEmployee(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Valid Employee`, func(t *testing.T) {
		employee := entity.Employee{
			Firstname:   "John",
			Lastname:    "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			StartDate:   time.Now(),
			Salary:      15000.00,
			Email:       "john.doe@example.com",
			Password:    "StrongPassword123!",
			PositionID:  1,
			GenderID:    1,
			RolesID:     1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}